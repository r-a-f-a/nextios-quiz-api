import { Controller, Get, Post, Put, Delete, ClassMiddleware } from '@overnightjs/core';
import { Request, Response, NextFunction } from 'express';
import { User } from '@src/models/users';
import { Verification } from '@src/models/verification';
import { authMiddleware } from '@src/middlewares/auth';
import GeneratorService from '@src/services/generator';
import MailService from '@src/services/mail';

@Controller('users')
@ClassMiddleware(authMiddleware)
export class UsersController {
    @Get('')
    public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = req.payload.filter ? req.payload.filter : {}
            const result = await User.find(filter);
            res.status(200).send({ code: 200, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Post('')
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const exists = await User.findOne({ email: req.payload.email });
            if (exists) res.status(200).send({ code: 200, result: exists });

            const user = new User({ email: req.payload.email });
            const result = await user.save();
            res.status(201).send({ code: 201, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Get(':id')
    public async show(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await User.findById(req.params.id);
            res.status(200).send({ code: 200, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Put(':id')
    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = { _id: req.params.id }
            const update = req.payload
            const result = await User.findOneAndUpdate(filter, update);
            res.status(201).send({ code: 201, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Delete(':id')
    public async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = { _id: req.params.id }
            const result = await User.findOneAndDelete(filter)
            res.status(200).send({ code: 200, result: result });
        } catch (error) {
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }

    @Post('verification/send')
    public async sendVerificationCode (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await User.findById(req.payload.userId);
            if (!user) res.status(400).send({ code: 400, error: 'USER_NOT_FOUND' });
            const userId = req.payload.userId;
            const code = GeneratorService.generateToken();
            const verificationCode = new Verification({ code, userId });
            const result = await verificationCode.save();
            if (!result) res.status(500).send({ code: 500 });
            const mail = new MailService();
            await mail.send({
                from: "comunicacaointerna@locaweb.com.br",
                to: user?.email,
                subject: "Quiz NEXTIOS: Código de verificação",
                html: `<!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Código de Verificação</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  /**
   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
   */
  @media screen {
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
    }

    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 700;
      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
    }
  }

  /**
   * Avoid browser level font resizing.
   * 1. Windows Mobile
   * 2. iOS / OSX
   */
  body,
  table,
  td,
  a {
    -ms-text-size-adjust: 100%; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }

  /**
   * Remove extra space added to tables and cells in Outlook.
   */
  table,
  td {
    mso-table-rspace: 0pt;
    mso-table-lspace: 0pt;
  }

  /**
   * Better fluid images in Internet Explorer.
   */
  img {
    -ms-interpolation-mode: bicubic;
  }

  /**
   * Remove blue links for iOS devices.
   */
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }

  /**
   * Fix centering issues in Android 4.4.
   */
  div[style*="margin: 16px 0;"] {
    margin: 0 !important;
  }

  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /**
   * Collapse table borders to avoid space between cells.
   */
  table {
    border-collapse: collapse !important;
  }

  a {
    color: #1a82e2;
  }

  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }
  </style>

</head>
<body style="background-color: #e9ecef;">

  <!-- start preheader -->
  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    Seu código é ${code}
  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <a href="https://sendgrid.com" target="_blank" style="display: inline-block;">
                <img src="https://www.nextios.com.br/images/logo-nextios.png?v=1.11.29" alt="Logo" border="0" width="48"
                  style="display: block; width: 200px; max-width: 200px; min-width: 200px;">
              </a>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Olá Locaweber!!!</h1>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0; text-align: center;">Falta pouco para você iniciar o quiz e ter a chance de ganhar um prêmio íncrivel.</p>
              <p style="margin: 0; text-align: center;">Utilize o código abaixo para iniciar o quiz:
              </p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start button -->
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                          <a href="https://quiz.nextios.com.br/validate/?code=${code}" target="_blank"
                            style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">${code}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end button -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0; text-align: center;">Se isso não funcionar, copie e cole o seguinte link no seu
                navegador:</p>
              <p style="margin: 0; text-align: center;"><a href="https://quiz.nextios.com.br/validate/?code=${code}"
                  target="_blank">https://quiz.nextios.com.br/validate/?code=${code}</a></p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
              <p style="margin: 0;">Boa sorte!</p>
            </td>
          </tr>
          <!-- end copy -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end copy block -->
  </table>
  <!-- end body -->

</body>
</html>
`
            });
            res.status?.(201).send({ code: 201, result: 'VERIFICATION_CODE_SENDED' });
        } catch (error) {
            console.log('ERROR', error);
            res.status?.(500).send({ code: 500, error: error.message });
        }
    }

    @Get('verification/validate')
    public async validateVerificationCode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await User.findById(req.payload.userId);
            if (!user) res.status(400).send({ code: 400, error: 'USER_NOT_FOUND' });
            const verification = await Verification.findOne({ userId: req.payload.userId, code: req.payload.code } );
            if (!verification) res.status(400).send({ code: 400, error: 'CODE_VALIDATION_DENIED' });
            const updated = await Verification.findByIdAndUpdate(verification?.id, { verificated: true });
            res.status(200).send({ code: 200, result: true });
        } catch (error) {
            console.log('ERROR', error);
            res.status?.(401).send({ code: 401, error: error.message });
        }
    }
}