const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


class App {

    constructor() {
        this.server = express();
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({ extended: true }));
        this.server.use(cors({ credentials: false }));

        this.middlewares();
        this.routes();
    }

    middlewares() {

        // Criando base de dados caso nao exista
        const sqlite3 = require('sqlite3').verbose();
        const db = new sqlite3.Database('database');

        // SCRIPT DE CRIACAO DO BANCO
        //db.serialize(() => {
        //  db.run("CREATE TABLE licencas (email TEXT, senha TEXT,pagamento DATE, expiracao DATE)");
        //})

    }

    routes() {

        this.server.post("/kiwify", async function (req, res) {
            const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database('database');
            let email, nome, ultimaPaga, proximaPagar;

            // Coleta dos dados do consumidor
            email = req.body.Customer.email;
            nome = req.body.Customer.full_name;
            ultimaPaga = '';
            proximaPagar = new Date(req.body.Subscription.charges.future[0].charge_date)

            // Pega a data do ultimo pagamento
            req.body.Subscription.charges.completed.forEach(element => {
                // Verifica se foi feito o pagamento 
                if (element.status == 'paid') {
                    let date = new Date(element.created_at);

                    if (ultimaPaga == '')
                        date = date

                    if (date > ultimaPaga)
                        ultimaPaga = date;
                }
            });

            // Verifica se o email ja foi cadastrado

            db.serialize(async () => {

               
                db.all("SELECT * FROM licencas where email = '" + email + "'", function (err, rows) {
                    
                    console.log(rows)

                    // Verifica se usuario tem cadastro
                    if (rows.length > 0) {
                        //          // Tem cadastros
                        const stmt = db.prepare("update licencas set pagamento = ?,expiracao = ?");
                        stmt.run(ultimaPaga.toLocaleDateString(), proximaPagar.toLocaleDateString());
                        stmt.finalize();
                        db.close();
                    }
                    else {
                        // Nao tem cadastro
                        const stmt = db.prepare("INSERT INTO licencas VALUES (?,?,?,?)");
                        stmt.run(email, "123456", ultimaPaga.toLocaleDateString(), proximaPagar.toLocaleDateString());
                        stmt.finalize();
                        db.close();
                    }
                })

            })

            res.send()
        })

    }

}
module.exports = new App().server