'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();


var serviceAccount = require("./google-credentials.json");
//admin.initializeApp(functions.config().firebase);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


app.get('/cryptocurrency', (req, res) => {
    admin.firestore().collection('cryptocurrency').get()
        .then(result => {
            var cryptocurrencies = []
            result.forEach((doc) => {
                cryptocurrencies.push(doc.data());
            });
            res.send(cryptocurrencies);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.get('/cryptocurrency/:symbol', (req, res) => {
    admin.firestore().collection('cryptocurrency').doc(req.params.symbol).get()
        .then(result => {
            res.send(result.data());
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

app.get('/cryptocurrency/order/:order_by/:order', (req, res) => {
    admin.firestore().collection('cryptocurrency').orderBy(req.params.order_by, req.params.order).get()
        .then(result => {
            var cryptocurrencies = []
            result.forEach((doc) => {
                cryptocurrencies.push(doc.data());
            });
            res.send(cryptocurrencies);
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});


exports.cryptocurrency = functions.https.onRequest(app);
