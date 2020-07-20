const express = require('express');
const path = require('path');
const port = 8000;

const db=require('./config/mongoose');
const Contact=require('./models/contact');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));
var contactList = [
    {
        name: "Arpan",
        phone: "1111111111"
    },
    {
        name: "Tony Stark",
        phone: "1234567890"
    },
    {
        name: "Coding Ninjas",
        phone: "12131321321"
    }
]

app.get('/practice', function(req, res){
    return res.render('practice', {
        title: "Let us play with ejs"
    });
});


app.get('/', function(req, res)
{
    // return res.render('home',{
    //     title: "Contact List",
    //     contact_list: contactList
    // });

    
    Contact.find({}, function(err, contacts){
        if(err){
            console.log("error in fetching contacts from db");
            return;
        }
        return res.render('home',{
            title: "Contact List",
            contact_list: contacts
        });

    })
})
app.post('/create-contact', function(req, res){
    
    // contactList.push({
        
    //     name: req.body.name,
    //     phone: req.body.phone,
    // })
   // contactList.push(req.body);
  
   Contact.create({
    name: req.body.name,
    phone: req.body.phone,
     }, function(err, newContact){
    if(err){console.log('Error in creating a contact!')
        return;}
        console.log('******', newContact);
        return res.redirect('back');
    })

});

app.get('/update-contact-form', function(req,res){
    return res.render('updateform',{
        title:"Update Form",
        id : req.query.id
    })
});

app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
})

app.get('/delete-contact/', function(req, res){
    console.log(req.query);
    // let phone = req.query.phone

    // let contactindex = contactList.findIndex(contact => contact.phone == phone);

    // if(contactindex != -1){
    //     contactList.splice(contactindex, 1);
    // }

    // return res.redirect('back');


    let id = req.query.id

    Contact.findOneAndDelete(id, function(err){
        if(err){
            console.log('error in deleting the object');
            return;
        }
        return res.redirect('back');
    })
});
app.post('/update-contact/', function(req, res){
    console.log(req.query);

    let id = req.query.id

    Contact.updateOne({_id:id},{$set: {name: req.body.name,phone: req.body.phone} },function(err){
        if(err){
            console.log('error in updating the object');
            return;
        }
        return res.redirect('/');
    })
});