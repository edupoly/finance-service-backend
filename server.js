var express = require('express');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var cors = require('cors');
var User = require('./models/user');
var Loan = require('./models/loan');
var Businessaccount = require('./models/businessAccount')
var Customer = require("./models/customer")
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

  /* planbased billing endpoints */

  app.post('/addBusinessAccount', (req, res) => {
    let newBusinessAccount = new Businessaccount(req.body);
    newBusinessAccount.save().then((bacc) => {
        res.json(bacc.businessName);
    });
});

app.post('/getBusiness', (req, res) => {
    Businessaccount.find({ primaryMobile: req.body.primaryMobile, password: req.body.password }).then((business) => {
        res.json(business);
    })
})

app.patch('/updatePlansById/:id', (req, res) => {
    Businessaccount.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { plans: { $each: req.body.plans } } },
        { new: true }
    ).then((business) => {
        res.json(business);
    })
})

app.patch('/updateServicesById/:id', (req, res) => {
    Businessaccount.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { services: { $each: req.body.services } } },
        { new: true }
    ).then((business) => {
        res.json(business);
    })
})

app.post('/addCustomer/:id', (req, res) => {
    Businessaccount.findByIdAndUpdate(
        { _id: req.params.id },
        { $push: { customers: req.body } },
        { new: true }
    ).then((business) => {
        let newCustomer = new Customer({ mobile: req.body.mobile });
        newCustomer.save().then((cust) => {
            res.json(req.body.mobile);
        });
    })
})

app.post('/getCustomer', (req, res) => {
    Customer.find({ mobile: req.body.mobile }).then((customer) => {
        res.json(customer);
    })
})

app.patch('/createPassword/:mobile', (req, res) => {
    Customer.findOneAndUpdate(
        { mobile: req.params.mobile },
        { $set: { password: req.body.password } },
        { new: true }
    ).then((customer) => {
        res.json(customer);
    })
})

app.patch('/updateCustomerDetails/:mobile', (req, res) => {
    Customer.findOneAndUpdate(
        { mobile: req.params.mobile },
        { $set: req.body },
        { new: true }
    ).then((customer) => {
        res.json(customer);
    })
})

app.get('/getCustomerDetails/:bId/:mobile', (req, res) => {
    Businessaccount.aggregate([
        { $match: { _id: new ObjectId(req.params.bId) } },
        {
            $project: {
                customers: {
                    $filter: {
                        input: "$customers",
                        as: "customer",
                        cond: { $eq: ["$$customer.mobile", req.params.mobile] }
                    }
                }
            }
        }
    ]).then((customer) => {
        res.json(customer);
    })
})

app.get('/getPlanByTitle/:bId/:plan', (req, res) => {
    Businessaccount.aggregate([
        { $match: { _id: new ObjectId(req.params.bId) } },
        {
            $project: {
                plans: {
                    $filter: {
                        input: "$plans",
                        as: "plan",
                        cond: { $eq: ["$$plan.title", req.params.plan] }
                    }
                }
            }
        }
    ]).then((plan) => {
        res.json(plan);
    })
})

app.get('/getServices/:bId', (req, res) => {
    Businessaccount.aggregate([
        { $match: { _id: new ObjectId(req.params.bId) } },
        { $project: { services: 1 } }
    ]).then((services) => {
        res.json(services);
    })
})

app.post('/addTransaction/:bId', (req, res) => {
    Businessaccount.findByIdAndUpdate(
        { _id: req.params.bId },
        { $push: { transactions: req.body } },
        { new: true }
    ).then((business) => {
        res.json(req.body.finalBill);
    })
})

app.get('/getAllCustomersByBusiness/:bId', (req, res) => {
    Businessaccount.aggregate([
        { $match: { _id: new ObjectId(req.params.bId) } },
        { $project: { customers: 1 } }
    ]).then((customers) => {
        res.json(customers);
    })
})

app.get('/getAllTransactionsByBusiness/:bId', (req, res) => {
    Businessaccount.aggregate([
        { $match: { _id: new ObjectId(req.params.bId) } },
        { $project: { transactions: 1 } }
    ]).then((transactions) => {
        res.json(transactions);
    })
})

app.get('/getAllTransactionsByCustomer/:mobile', (req, res) => {
    Businessaccount.aggregate([
        {
            $unwind: '$transactions'
        },
        {
            $match: { 'transactions.customerMobile': req.params.mobile }
        },
        {
            $project: {
                _id: 0,
                businessName: '$businessName',
                date: '$transactions.date',
                customerMobile: '$transactions.customerMobile',
                plan: '$transactions.plan',
                availedServices: '$transactions.availedServices',
                totalBill: '$transactions.totalBill',
                finalBill: '$transactions.finalBill'
            }
        }
    ]).then((transactions) => {
        res.json(transactions);
    })
})

app.patch('/updatePlan/:bid/:title', (req, res) => {
    Businessaccount.findByIdAndUpdate(
        { _id: req.params.bid },
        {
            $set: {
                "plans.$[planToUpdate]": req.body,
            },
        },
        {
            arrayFilters: [
                { "planToUpdate.title": req.params.title }
            ],
            new: true
        }
    ).then((business) => {
        res.json(business)
    })
})

app.delete('/deletePlan/:bid/:title', (req, res) => {
    Businessaccount.findByIdAndUpdate(
        { _id: req.params.bid },
        {
            $pull: {
                plans: { title:req.params.title },
            },
        }
    ).then((business) => {
        res.json(business)
    })
})

app.patch('/updateService/:bid/:title', (req, res) => {
    Businessaccount.findByIdAndUpdate(
        { _id: req.params.bid },
        {
            $set: {
                "services.$[serviceToUpdate]": req.body,
            },
        },
        {
            arrayFilters: [
                { "serviceToUpdate.title": req.params.title }
            ],
            new: true
        }
    ).then((business) => {
        res.json(business)
    })
})

app.delete('/deleteService/:bid/:title', (req, res) => {
    Businessaccount.findByIdAndUpdate(
        { _id: req.params.bid },
        {
            $pull: {
                services: { title:req.params.title },
            },
        }
    ).then((business) => {
        res.json(business)
    })
})

app.listen(4600, () => {
    console.log('running at 4600')
}
);