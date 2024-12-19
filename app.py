from flask import Flask, render_template
from models import initialize_database
from routes import blueprints

app = Flask(__name__)

# データベースの初期化
initialize_database()

for blueprint in blueprints:
		app.register_blueprint(blueprint)

# トップページのルーティング
@app.route('/')
def index():
	return render_template('index.html')

if __name__ == '__main__':
	app.run(port = 8088, debug = True)