var express = require('express');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var cors = require('cors');
var User = require('./models/user');
var Loan = require('./models/loan');
var app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect('mongodb+srv://infoedupoly:edupoly83@cluster0.eitlw5l.mongodb.net/finance-service');

app.post('/addUser', (req, res) => {
    let newUser = new User(req.body);
    newUser.save().then((user) => {
        res.json(user.firstname);
    });
});

app.patch('/createPassword/:email', (req, res) => {
    User.findOneAndUpdate(
        { email: req.params.email },
        { $set: { password: req.body.password } },
        { new: true }
    ).then((customer) => {
        res.json(customer);
    })
})

app.post('/getUser', (req, res) => {
    User.find({ email: req.body.email, password: req.body.password }).then((user) => {
        res.json(user);
    })
})

app.get('/getUserByEmail/:email', (req, res) => {
    User.find({ email: req.params.email }).then((user) => {
        res.json(user);
    })
})

app.post('/addLoan', (req, res) => {
    let newLoan = new Loan(req.body);
    newLoan.save().then((loan) => {
        res.json(loan);
    });
});

app.get('/getAllLoans', (req, res) => {
    Loan.find({}).then((loans)=>{
        res.json(loans);
    })
});

app.get('/getLoanById/:id', (req, res) => {
    Loan.find({ _id: req.params.id}).then((loan) => {
        res.json(loan);
    })
})

app.get('/getAllLoansByAgentMail/:agentMail', (req, res) => {
    Loan.find({ agentMail: req.params.agentMail}).then((loans) => {
        res.json(loans);
    })
})

app.get('/getAllLoansByCustomerEmail/:customerEmail', (req, res) => {
    Loan.find({ customerEmail: req.params.customerEmail}).then((loans) => {
        res.json(loans);
    })
})

app.patch('/updateLoanStatus/:loanId', (req, res) => {
    Loan.findOneAndUpdate(
        { _id: req.params.loanId },
        { $set: { status: req.body.status } },
        { new: true }
    ).then((loan) => {
        res.json(loan);
    })
})

app.patch('/setInstallmentsById/:id', (req, res) => {
    Loan.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { installments: { $each: req.body } } },
        { new: true }
    ).then((loan) => {
        res.json(loan);
    })
})

app.patch('/startEmi/:id', (req, res) => {
    Loan.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { emiStarted: req.body.emiStarted } },
        { new: true }
    ).then((loan) => {
        res.json(loan);
    })
})

app.patch('/updateEmi/:id/:duedate', (req, res) => {
    Loan.findByIdAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                "installments.$[emiToUpdate]": req.body,
            },
        },
        {
            arrayFilters: [
                { "emiToUpdate.installmentDueDate": parseInt(req.params.duedate) }
            ],
            new: true
        }
    ).then((loan) => {
        res.json(loan)
    })
})

app.patch('/updateAllEmis/:id', (req, res) => {
    Loan.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          "installments.$[].status": req.body.status
        }
      },
      { new: true }
    )
    .then((loan) => {
      res.json(loan);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error updating installments");
    });
  });

app.listen(4600, () => {
    console.log('running at 4600')
}
);