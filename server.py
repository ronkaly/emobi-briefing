import http.server
import socketserver
import json
import sqlite3
import os
import io
import csv

PORT = 8000
DB_VOTES = 'votacao_novos_servicos.db'
DB_PRESENCA = 'lista_de_presenca.db'

# Initialize Databases
def init_db():
    # Database for voting
    conn1 = sqlite3.connect(DB_VOTES)
    cursor1 = conn1.cursor()
    cursor1.execute('''
        CREATE TABLE IF NOT EXISTS votos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            opcoes TEXT,
            sugestao_personalizada TEXT
        )
    ''')
    conn1.commit()
    conn1.close()

    # Database for RSVP / Confirmation
    conn2 = sqlite3.connect(DB_PRESENCA)
    cursor2 = conn2.cursor()
    cursor2.execute('''
        CREATE TABLE IF NOT EXISTS presencas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            nome TEXT,
            whatsapp TEXT,
            cargo TEXT,
            feedback TEXT,
            simular_imoveis INTEGER,
            testar_whatsapp INTEGER,
            habilidades_sugeridas TEXT
        )
    ''')
    conn2.commit()
    conn2.close()

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/votar':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                opcoes = data.get('opcoes', [])
                sugestao = data.get('sugestao', '')
                
                # Save to database
                conn = sqlite3.connect(DB_VOTES)
                cursor = conn.cursor()
                cursor.execute(
                    'INSERT INTO votos (opcoes, sugestao_personalizada) VALUES (?, ?)',
                    (json.dumps(opcoes, ensure_ascii=False), sugestao)
                )
                conn.commit()
                conn.close()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {'status': 'success', 'message': 'Voto registrado com sucesso!'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {'status': 'error', 'message': str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))

        elif self.path == '/api/confirmar':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                nome = data.get('nome', '')
                whatsapp = data.get('whatsapp', '')
                cargo = data.get('cargo', '')
                feedback = data.get('feedback', '')
                simular_imoveis = 1 if data.get('simular_imoveis', False) else 0
                testar_whatsapp = 1 if data.get('testar_whatsapp', False) else 0
                habilidades = data.get('habilidades', [])
                
                # Save to database
                conn = sqlite3.connect(DB_PRESENCA)
                cursor = conn.cursor()
                cursor.execute(
                    '''INSERT INTO presencas 
                       (nome, whatsapp, cargo, feedback, simular_imoveis, testar_whatsapp, habilidades_sugeridas) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)''',
                    (nome, whatsapp, cargo, feedback, simular_imoveis, testar_whatsapp, json.dumps(habilidades, ensure_ascii=False))
                )
                conn.commit()
                conn.close()
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {'status': 'success', 'message': 'Confirmação registrada com sucesso!'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response = {'status': 'error', 'message': str(e)}
                self.wfile.write(json.dumps(response).encode('utf-8'))

        elif self.path == '/api/admin/export':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                username = data.get('username', '')
                password = data.get('password', '')
                export_type = data.get('type', '')
                
                if username == 'admin' and password == 'C3lul4r':
                    output = io.StringIO()
                    writer = csv.writer(output, delimiter=';', quotechar='"', quoting=csv.QUOTE_MINIMAL)
                    
                    if export_type == 'votos':
                        # Fetch votes
                        conn = sqlite3.connect(DB_VOTES)
                        cursor = conn.cursor()
                        cursor.execute("SELECT id, timestamp, opcoes, sugestao_personalizada FROM votos")
                        rows = cursor.fetchall()
                        conn.close()
                        
                        writer.writerow(['ID', 'Data/Hora', 'Opções Selecionadas', 'Sugestão Personalizada'])
                        for r in rows:
                            writer.writerow(r)
                            
                    elif export_type == 'presencas':
                        # Fetch RSVPs
                        conn = sqlite3.connect(DB_PRESENCA)
                        cursor = conn.cursor()
                        cursor.execute("SELECT id, timestamp, nome, whatsapp, cargo, feedback, simular_imoveis, testar_whatsapp, habilidades_sugeridas FROM presencas")
                        rows = cursor.fetchall()
                        conn.close()
                        
                        writer.writerow(['ID', 'Data/Hora', 'Nome', 'WhatsApp', 'Cargo', 'Dúvidas/Sugestões', 'Simular Imóveis (1=Sim)', 'Testar WhatsApp (1=Sim)', 'Habilidades Sugeridas'])
                        for r in rows:
                            writer.writerow(r)
                    else:
                        raise ValueError("Tipo de exportação inválido.")
                        
                    csv_data = output.getvalue()
                    output.close()
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/csv; charset=utf-8')
                    self.send_header('Content-Disposition', f'attachment; filename=export_{export_type}.csv')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    # Use utf-8-sig (with BOM) so Excel opens it correctly with all Portuguese accents
                    self.wfile.write(csv_data.encode('utf-8-sig'))
                else:
                    self.send_response(401)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'status': 'error', 'message': 'Credenciais inválidas.'}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def end_headers(self):
        # Add CORS header to all standard responses
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    init_db()
    print(f"Servidor rodando em http://localhost:{PORT}")
    # Allow address reuse to avoid port block on restart
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        httpd.serve_forever()
