from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

#...

class User(db.Model):
    __tablename__ = 'test'

    id = db.Column(db.Integer, primary_key=True)
    user_last_name = db.Column(db.String)
    user_name = db.Column(db.String)
    user_in_date = db.Column(db.Date)
    user_out_date = db.Column(db.Date)
    user_category = db.Column(db.String)
    user_function = db.Column(db.String)
    user_sex = db.Column(db.String)
    user_email = db.Column(db.String)
    user_telephone = db.Column(db.String, default='')
    user_title = db.Column(db.String, default='')
    user_pw_hash = db.Column(db.String, default='')
    user_home_address = db.Column(db.String, default='')
    user_private_phone = db.Column(db.String, default='')
    user_is_pi = db.Column(db.Integer)
    user_is_phd = db.Column(db.Integer)
    user_alternative_id = db.Column(db.Integer, default=-1)
    user_can_see_private_data = db.Column(db.Integer, default=0)
    user_can_add_user = db.Column(db.Integer, default=0)
    user_can_see_financial_data = db.Column(db.Integer, default=0)

    def is_active(self):
        """True, as all users are active."""
        return True

    def get_id(self):
        """Return the email address to satisfy Flask-Login's requirements."""
        return self.id

    def is_authenticated(self):
        """Return True if the user is authenticated."""
        return self.authenticated

    def is_anonymous(self):
        """False, as anonymous users aren't supported."""
        return False