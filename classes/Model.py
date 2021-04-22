from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# ...

class Picture(db.Model):
    __tablename__ = 'pictures'

    id = db.Column(db.Integer, primary_key=True)
    picture_name = db.Column(db.Text)
    user_id = db.Column(db.Integer, default=-1)
    equipment_id = db.Column(db.Integer, default=-1)

    def get_id(self):
        """Return the id to satisfy Flask-Login's requirements."""
        return self.id


class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    document_name = db.Column(db.Text)
    user_id = db.Column(db.Integer, default=-1)
    equipment_id = db.Column(db.Integer, default=-1)

    def get_id(self):
        """Return the id to satisfy Flask-Login's requirements."""
        return self.id


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    user_last_name = db.Column(db.String)
    user_name = db.Column(db.String)
    user_category = db.Column(db.String, default='')
    user_function = db.Column(db.String, default='')
    user_sex = db.Column(db.String)
    user_email = db.Column(db.String)
    user_telephone = db.Column(db.String, default='')
    user_title = db.Column(db.String, default='')
    user_home_address = db.Column(db.String, default='')
    user_private_phone = db.Column(db.String, default='')
    user_is_pi = db.Column(db.Integer, default=-1)
    user_is_phd = db.Column(db.Integer, default=-1)
    user_in_date = db.Column(db.Text, default=-1)
    user_out_date = db.Column(db.Text, default=-1)

    user_alternative_id = db.Column(db.Integer, default=-1)
    user_pw_hash = db.Column(db.String, default='')

    user_is_allowed = db.Column(db.Integer, default=0)
    user_date_when_allowed = db.Column(db.Text, default=-1)
    user_completed_profile = db.Column(db.Integer, default=0)
    user_set_pw = db.Column(db.Integer, default=0)

    user_is_financial_team = db.Column(db.Integer, default=0)
    user_is_admin = db.Column(db.Integer, default=0)
    user_is_lender = db.Column(db.Integer, default=1)
    user_is_lender_admin = db.Column(db.Integer, default=0)
    user_is_owner = db.Column(db.Integer, default=0)

    def is_active(self):
        """True, as all users are active."""
        return True

    def get_id(self):
        """Return the id to satisfy Flask-Login's requirements."""
        return self.id

    def get_email(self):
        """Return the email address to satisfy Flask-Login's requirements."""
        return self.user_email

    def is_authenticated(self):
        return self.authenticated

    def is_anonymous(self):
        """False, as anonymous users aren't supported."""
        return False

    def is_allowed(self):
        return self.user_is_allowed

    def completed_profile(self):
        return self.user_completed_profile

    def changed_temp_password(self):
        return self.user_changed_temp_pw

    def is_financial_team(self):
        return self.user_is_financial_team

    def is_admin(self):
        return self.user_is_admin

    def is_lender(self):
        return self.user_is_lender

    def is_lender_admin(self):
        return self.user_is_lender_admin

    def is_owner(self):
        return self.user_is_owner
