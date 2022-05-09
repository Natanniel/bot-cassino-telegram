from telegram.ext.updater import Updater # Conter a chave da api vinda do botfather
from telegram.update import Update # Isso será invocado toda vez que um bot receber uma atualização
from telegram.ext.callbackcontext import CallbackContext # Não usaremos sua funcionalidade diretamente em nosso código, mas quando adicionarmos o dispatcher, será necessário (e funcionará internamente)
from telegram.ext.commandhandler import CommandHandler #Esta classe Handler é usada para lidar com qualquer comando enviado pelo usuário ao bot, um comando sempre começa com “/” ou seja, “/start”,”/help” etc.
from telegram.ext.messagehandler import MessageHandler #Esta classe Handler é usada para lidar com qualquer mensagem normal enviada pelo usuário ao bot
from telegram.ext.filters import Filters # Isso filtrará texto normal, comandos, imagens, etc. de uma mensagem enviada.
import re
from core.usuario import verificaEmailCadastrado

updater = Updater("5381757657:AAFBwtpgAagVYW7wZELhIDsq0xGRWrJ4JYw", use_context=True)

#   Processo do BOT
#   1 - Inicializar atravez do comando start
#   2 - Solicitar ao usuario o email cadastrado




# inicializar o processo do BOT
def start(update: Update, context: CallbackContext):
    f = open("usuarios.txt", "a")
    f.write(str(update.message.chat_id) + '|0|' + '\n')
    f.close()
    update.message.reply_text("Informe abaixo o seu e-mail exatamente como você colocou quando foi realizar a sua inscrição em nosso produto :")
   
# Usuario informou o email
def validarEmail(update: Update, context: CallbackContext):
    verificaEmailCadastrado()        
    update.message.reply_text("Informe abaixo o seu e-mail exatamente como você colocou quando foi realizar a sua inscrição em nosso produto :")
    #print('teste')
   # if not re.match(r"... regex here ...", "satan.com.br"):
   #     update.message.reply_text("Por favor informe um email válido")
    



##update.message.chat_id
#update.message



def recepcionar(update: Update, context: CallbackContext):

    
    
    if not re.match(r"[^@]+@[^@]+\.[^@]+", update.message.text):
        update.message.reply_text("Por favor informe um email válido")
    else:
        validarEmail(update,context)


updater.dispatcher.add_handler(CommandHandler('start', start))
updater.dispatcher.add_handler(MessageHandler(Filters.text, recepcionar))

updater.start_polling()
print('bot iniciado')
