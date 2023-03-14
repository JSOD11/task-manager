const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'justinodwyer@college.harvard.edu',
    subject: 'Thanks for joining!',
    text: `Welcome to the app, ${name}!`
  })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'justinodwyer@college.harvard.edu',
    subject: 'Sorry to see you go!',
    text: `Sorry to see you go, ${name}.`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}