const express = require('express');
const router = express.Router();
const { collection, blogCollection, ContactCollection } = require('../DataBase/schema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport')





//post blog route to show all blogs on home page
router.post('/home', async (req, res) => {
  const { route, loadedBlog } = req.body;
  if (route === "") {
    const homeblog = await blogCollection.find().limit(loadedBlog).sort();
    res.json(homeblog)
  }
  else {
    const sortedblog = await blogCollection.find({ category: route }).limit(loadedBlog);
    res.json(sortedblog)
  }
})

//home loadmore 
router.post('/home/loadmore', async (req, res) => {
  const { loadedBlog } = req.body;
  const moreBlogs = await blogCollection.find().limit(loadedBlog)
  res.json(moreBlogs)
})

//home and blog section search route
router.post('/search/home', async (req, res) => {
  const { search } = req.body;
  const allblogs = await blogCollection.find();
  const filtered = allblogs.filter((blog) => {
    return blog.heading.toLowerCase().includes(search.toLowerCase()) ||
      blog.bigblog.toLowerCase().includes(search.toLowerCase())
  })
  res.json(filtered)
})


//post blog sorted
router.post('/blog', async (req, res) => {
  const { route, limit } = req.body;
  if (route === '') {
    const sortedBlogs = await blogCollection.find().limit(limit);
    res.json(sortedBlogs)
  } else {
    const sortedBlogs = await blogCollection.find({ category: route }).limit(limit);
    res.json(sortedBlogs)
  }
})


//singleBlog
router.post('/blog/:id', async (req, res) => {
  const { id } = req.body;
  const findBlog = await blogCollection.findById(id);
  res.json(findBlog);
})

// router.post('/delete/:id', async (req, res) => {
//     const id = req.params.id;
//     const deletepost = await blogCollection.findByIdAndDelete(id)
//     res.json(deletepost);
// })


//handle contact form getting user data
router.post('/contact', async (req, res) => {
  const { token } = req.body;
  const verify = jwt.verify(token, process.env.JWT_SECREAT);
  const user = await collection.findById(verify.id);
  res.json(user)
})


//handling contact form send message
router.post('/contact/form', async (req, res) => {
  const { inputValue } = req.body;
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'personal.mdhossain@gmail.com',
      pass: 'ozswfghfmufxfcss'
    }
  });

  async function main() {
    const info = await transporter.sendMail({
      to: '"Hossain" <personal.mdhossain@gmail.com>',
      from: `${inputValue.name}, ${inputValue.email}`,
      subject: "Some one want to contact with you",
      html: `Sender name: ${inputValue.name}, email: ${inputValue.email}, message: ${inputValue.message}`,
    });
    res.json(info.messageId)
  }
  main().catch(console.error);
})



//comments in single blog section
router.post('/comment', async (req, res) => {
  const { singleBlog, comment, userData } = req.body;
  const currentDate = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  const blog = await blogCollection.findByIdAndUpdate(singleBlog._id, {
    $push: {
      comments: {
        _id: Math.floor(Math.random() * 10000),
        name: `${userData.firstname} ${userData.lastname}`,
        date: formattedDate,
        comment: comment
      }
    }
  });
  await blog.save();
  res.json(blog)
})

router.post('/updateBlog', async (req, res) => {
  const { id, singleBlog } = req.body;
  const singleBlogUpdate = await blogCollection.findByIdAndUpdate(id, {
    img: singleBlog.img,
    heading: singleBlog.heading,
    bigblog: singleBlog.bigblog,
    category: singleBlog.category,
  });
  res.json(singleBlogUpdate);
})



router.post('/edit', async (req, res) => {
  const { id } = req.body;
  const singleBlog = await blogCollection.findById(id);
  res.json(singleBlog)
})

//handle Read Single blog
router.post('/blog/id', async (req, res) => {
  const { link } = req.body;
  const findOne = await blogCollection.findById({ id })
  res.json(findOne)
})


//handle delete
router.post('/delete/:id', async (req, res) => {
  const { id } = req.body;
  const deleteBlog = await blogCollection.findByIdAndDelete(id);
  res.json(deleteBlog);
})



//create new user (signup)
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const isEmailUnique = await collection.findOne({ email });
    if (isEmailUnique) {
      return res.json({ 'error': 'User Alerdy Exist. Try with diffenent Email' })
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new collection({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hash
    })
    const nodemailer = require("nodemailer");
    const otp = Math.floor(Math.random() * 100000)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'personal.mdhossain@gmail.com',
        pass: 'ozswfghfmufxfcss'
      }
    });

    async function main() {
      const info = await transporter.sendMail({
        from: '"Hossain" <personal.mdhossain@gmail.com>',
        to: `${firstname}, ${email}`,
        subject: "Welcome to Blogia. Blogia Registration OTP",
        html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                <!--[if gte mso 9]>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:AllowPNG/>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <meta name="x-apple-disable-message-reformatting">
                  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
                  <title></title>
                  
                    <style type="text/css">
                      @media only screen and (min-width: 620px) {
                  .u-row {
                    width: 600px !important;
                  }
                  .u-row .u-col {
                    vertical-align: top;
                  }
                
                  .u-row .u-col-100 {
                    width: 600px !important;
                  }
                
                }
                
                @media (max-width: 620px) {
                  .u-row-container {
                    max-width: 100% !important;
                    padding-left: 0px !important;
                    padding-right: 0px !important;
                  }
                  .u-row .u-col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                  }
                  .u-row {
                    width: 100% !important;
                  }
                  .u-col {
                    width: 100% !important;
                  }
                  .u-col > div {
                    margin: 0 auto;
                  }
                }
                body {
                  margin: 0;
                  padding: 0;
                }
                
                table,
                tr,
                td {
                  vertical-align: top;
                  border-collapse: collapse;
                }
                
                p {
                  margin: 0;
                }
                
                .ie-container table,
                .mso-container table {
                  table-layout: fixed;
                }
                
                * {
                  line-height: inherit;
                }
                
                a[x-apple-data-detectors='true'] {
                  color: inherit !important;
                  text-decoration: none !important;
                }
                
                table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_heading_1 .v-container-padding-padding { padding: 40px 10px 0px !important; } #u_content_heading_1 .v-font-size { font-size: 20px !important; } #u_content_heading_2 .v-font-size { font-size: 35px !important; } #u_content_text_2 .v-container-padding-padding { padding: 10px !important; } #u_content_text_3 .v-container-padding-padding { padding: 20px 10px 40px !important; } #u_content_social_1 .v-container-padding-padding { padding: 40px 10px 10px !important; } #u_content_text_9 .v-container-padding-padding { padding: 10px 10px 20px !important; } }
                    </style>
                  
                  
                
                <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
                
                </head>
                
                <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
                  <!--[if IE]><div class="ie-container"><![endif]-->
                  <!--[if mso]><div class="mso-container"><![endif]-->
                  <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
                  <tbody>
                  <tr style="vertical-align: top">
                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
                    
                
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
                      
                <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #081c34;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div style="background-color: #081c34;height: 100%;width: 100% !important;">
                  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                  
                <table id="u_content_heading_1" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:60px 10px 0px;font-family:'Open Sans',sans-serif;" align="left">
                        
                  <h1 class="v-font-size" style="margin: 0px; color: #ffffff; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 22px; font-weight: 400;">Welcome to</h1>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <table id="u_content_heading_2" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px;font-family:'Open Sans',sans-serif;" align="left">
                        
                  <h1 class="v-font-size" style="margin: 0px; color: #007fec; line-height: 120%; text-align: center; word-wrap: break-word; font-size: 45px; font-weight: 400;"><strong>Blogia</strong></h1>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <table id="u_content_text_2" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 50px;font-family:'Open Sans',sans-serif;" align="left">
                        
                  <div class="v-font-size" style="font-size: 14px; color: #ced4d9; line-height: 140%; text-align: center; word-wrap: break-word;">
                    <p style="line-height: 140%;">Thanks for signup in the Blogia </p>
                  </div>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Open Sans',sans-serif;" align="left">
                        
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
                      
                      <img align="center" border="0" src="images/image-4.png" alt="image" title="image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 600px;" width="600"/>
                      
                    </td>
                  </tr>
                </table>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <table id="u_content_text_3" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:30px 50px 60px;font-family:'Open Sans',sans-serif;" align="left">
                        
                  <div class="v-font-size" style="font-size: 14px; color: #ced4d9; line-height: 140%; text-align: center; word-wrap: break-word;">
                    <p style="line-height: 140%;">You verfication Code for registration is ${otp} </p>
                  </div>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
                
                
                
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->
                      
                <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #081c34;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div style="background-color: #081c34;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                  <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
                  
                <table id="u_content_social_1" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:60px 10px 10px;font-family:'Open Sans',sans-serif;" align="left">
                        
                <div align="center">
                  <div style="display: table; max-width:167px;">
                  <!--[if (mso)|(IE)]><table width="167" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:167px;"><tr><![endif]-->
                  
                    
                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 10px;" valign="top"><![endif]-->
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 10px">
                      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                        <a href="https://www.facebook.com/unlayer" title="Facebook" target="_blank">
                          <img src="images/image-1.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                        </a>
                      </td></tr>
                    </tbody></table>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    
                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 10px;" valign="top"><![endif]-->
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 10px">
                      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                        <a href="https://twitter.com/unlayerapp" title="Twitter" target="_blank">
                          <img src="images/image-2.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                        </a>
                      </td></tr>
                    </tbody></table>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    
                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 10px;" valign="top"><![endif]-->
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 10px">
                      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                        <a href="https://www.linkedin.com/company/unlayer/mycompany/" title="LinkedIn" target="_blank">
                          <img src="images/image-5.png" alt="LinkedIn" title="LinkedIn" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                        </a>
                      </td></tr>
                    </tbody></table>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    
                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                        <a href="https://www.instagram.com/unlayer_official/" title="Instagram" target="_blank">
                          <img src="images/image-3.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                        </a>
                      </td></tr>
                    </tbody></table>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    
                    
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                  </div>
                </div>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <table id="u_content_text_9" style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 100px 30px;font-family:'Open Sans',sans-serif;" align="left">
                        
                  <div class="v-font-size" style="font-size: 14px; color: #7e8c8d; line-height: 170%; text-align: center; word-wrap: break-word;">
                    <p style="font-size: 14px; line-height: 170%;">Subscribe   |   PRIVACY POLICY   |   WEB</p>
                <p style="font-size: 14px; line-height: 170%;"> </p>
                <p style="font-size: 14px; line-height: 170%;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                  </div>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <table style="font-family:'Open Sans',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px;font-family:'Open Sans',sans-serif;" align="left">
                        
                  <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                      <tr style="vertical-align: top">
                        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                          <span>&#160;</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                  </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
                
                
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                  </tbody>
                  </table>
                  <!--[if mso]></div><![endif]-->
                  <!--[if IE]></div><![endif]-->
                </body>
                
                </html>
                `,
      });
      res.json({ 'otp': otp, isEmailUnique })
    }
    main();
  } catch (err) { console.log(err) }
})
router.post('/register/optverify', async (req, res) => {
  const { userData } = req.body;
  const { firstname, lastname, email, password } = userData;
  const hash = await bcrypt.hash(password, 10);
  const user = new collection({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: hash
  })
  const result = await user.save();
  res.json(result)
})


//login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await collection.findOne({ email });
    if (!checkUser) {
      return res.json({ "error": "Invalid user data" });
    }
    const comparePass = await bcrypt.compare(password, checkUser.password)
    if (!comparePass) {
      return res.json({ "error": "Invalid user data" });
    }
    if (checkUser && comparePass) {
      const token = jwt.sign({ id: checkUser._id }, process.env.JWT_SECREAT);
      res.cookie('login_jwt', token, { httpOnly: true, secure: true })
      res.json({ token, checkUser })
    }

  } catch (err) {
    console.log(err)
  }
})





// auth



////////////////////////Admin routes//////////////////






//adding blog
router.post('/admin/blog/add', async (req, res) => {
  try {
    const { blogContent } = req.body;
    const { heading, img, category, blog } = blogContent
    const creatblog = await new blogCollection({
      img: img,
      heading: heading,
      smallblog: blog.slice(0, 100) + '...',
      bigblog: blog,
      category: category
    })
    const result = await creatblog.save();
    res.json(result)
  } catch (err) {
    console.log(err)
  }
})



module.exports = router;



