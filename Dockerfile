FROM python:3.7

# INSTALL GIT
RUN apt-get update \        
     apt-get install -y git

# PULL FROM REPOSITORY
WORKDIR /RevalEquip
COPY . /RevalEquip

# INSTALL FLASK
RUN pip install -r Flask==0.12
RUN pip install -r flask_login==0.4.1
RUN pip install -r flask_sqlalchemy==2.5.1

CMD ["python", "app.py"]