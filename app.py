from datetime import datetime

from flask import Flask, session
from flask_apscheduler import APScheduler
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

from blue_access_management import access_management
from blue_auth import auth
from blue_change_password import change_password
from blue_equipment import equipment
from blue_files import files
from blue_profile import profile
from blue_reset_password import reset_password
from blue_suppliers import suppliers
from blue_users import users
from classes.Database import Database
from classes.Model import User

app = Flask(__name__)

scheduler = APScheduler()

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///revalEquip.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app.config['SECRET_KEY'] = 'wwzzxxsecretekeytodatabase'

app.register_blueprint(equipment)
app.register_blueprint(users)
app.register_blueprint(profile)
app.register_blueprint(suppliers)
app.register_blueprint(auth)
app.register_blueprint(change_password)
app.register_blueprint(reset_password)
app.register_blueprint(files)
app.register_blueprint(access_management)

# -------------------------------------------------------------------------------

db1 = Database()
db1.create_db()
db = SQLAlchemy(app)

# -------------------------------------------------------------------------------

login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.init_app(app)


# def check_for_users_that_did_not_change_password_within_30_days():
#     result = session.query(User).all()
#     print(result)
#     for user in users:
#         if user['user_is_allowed'] == 1 and user['user_set_pw'] == 0:
#             user_date_when_allowed = user['user_date_when_allowed']
#             date_allowed = datetime.strptime(user_date_when_allowed, '%d/%m/%Y')
#             date_now = datetime.date
#             print(date_allowed, date_now)


@login_manager.user_loader
def load_user(user_id):
    # return User.query.get(int(user_id))
    print(User.query.filter_by(id=user_id))
    return User.query.filter_by(id=user_id).first()


@app.route("/test")
def test():
    return '123'


if __name__ == '__main__':
    # scheduler.add_job(id='Scheduled task', func=check_for_users_that_did_not_change_password_within_30_days,
    #                   trigger='interval', seconds=1)
    # scheduler.start()

    # app.run(debug=True, use_reloader=True)
    app.run(host="0.0.0.0", port=5000)
