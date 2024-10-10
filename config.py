class Config(object):
    
    SECRET_KEY="thisissecret"
    SECURITY_PASSWORD_SALT="thisissalt"
    WTF_CSRF_ENABLED=False
    SECURITY_TOKEN_AUTHENTICATION_HEADER='Authentication-Token'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG=True    

