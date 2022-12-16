import inspect
import OpenSSL
import os
import time
import argparse
from PDFNetPython3.PDFNetPython import *
from typing import Tuple


def createKeyPair(type, bits):
    pkey = OpenSSL.crypto.PKey()
    pkey.generate_key(type, bits)
    return pkey




def create_self_signed_cert(pKey):
    cert = OpenSSL.crypto.X509()
    cert.get_subject().CN = "ELIBRARY by Andrei Chaplinski"
    cert.set_serial_number(int(time.time() * 10))
    cert.gmtime_adj_notBefore(0)  
    cert.gmtime_adj_notAfter(10 * 365 * 24 * 60 * 60)
    cert.set_issuer((cert.get_subject()))
    cert.set_pubkey(pKey)
    cert.sign(pKey, 'md5')  
    return cert




def load():
    summary = {}
    summary['OpenSSL Version'] = OpenSSL.__version__
    key = createKeyPair(OpenSSL.crypto.TYPE_RSA, 1024)
    with open('static\images\signatures\private_key.pem', 'wb') as pk:
        pk_str = OpenSSL.crypto.dump_privatekey(OpenSSL.crypto.FILETYPE_PEM, key)
        pk.write(pk_str)
        summary['Private Key'] = pk_str
    cert = create_self_signed_cert(pKey=key)
    with open('static\images\signatures\certificate.cer', 'wb') as cer:
        cer_str = OpenSSL.crypto.dump_certificate(
            OpenSSL.crypto.FILETYPE_PEM, cert)
        cer.write(cer_str)
        summary['Self Signed Certificate'] = cer_str
    with open('static\images\signatures\public_key.pem', 'wb') as pub_key:
        pub_key_str = OpenSSL.crypto.dump_publickey(
            OpenSSL.crypto.FILETYPE_PEM, cert.get_pubkey())
        pub_key.write(pub_key_str)
        summary['Public Key'] = pub_key_str
    p12 = OpenSSL.crypto.PKCS12()
    p12.set_privatekey(key)
    p12.set_certificate(cert)
    open('static\images\signatures\container.pfx', 'wb').write(p12.export())
    # print("## Initialization Summary ##################################################")
    # print("\n".join("{}:{}".format(i, j) for i, j in summary.items()))
    # print("############################################################################")
    return True




def sign_file(sign_img: str, input_file: str, signatureID: str, x_coordinate: int, 
            y_coordinate: int, pages: Tuple = None, output_file: str = None
              ):
    input_file = 'static/images/' + input_file
    if not output_file:
        output_file = (os.path.splitext(input_file)[0]) + "_signed.pdf"
    PDFNet.Initialize("demo:1670960872313:7a97ac550300000000c15d5886bdec5cb4a6d245b6c0883eda51597b68")
    # print(input_file)
    doc = PDFDoc(input_file)
    # test = doc.GetPage(1)
    # print(inspect.getmembers(test))
    # print(test.GetUserUnitSize())
    # oRtn = test.GetRotation()
    # rotation = None
    # if oRtn == Page.e_0:
    #     rotation = Page.e_90
    # elif oRtn == Page.e_90:
    #     rotation = Page.e_180
    # elif oRtn == Page.e_180:
    #     rotation = Page.e_270
    # elif oRtn == Page.e_270:
    #     rotation = Page.e_0
    # else:
    #     rotation = Page.e_0
    # test.SetRotation(rotation)
    # print(rotation)



    sigField = SignatureWidget.Create(doc, Rect(
        x_coordinate, y_coordinate, x_coordinate+100, y_coordinate+50), signatureID)
    for page in range(1, (doc.GetPageCount() + 1)):
        if pages:
            if (page) not in pages:
                continue
        pg = doc.GetPage(page)
        pg.AnnotPushBack(sigField)
    sign_filename = sign_img
    # sign_filename = "static\images\signatures\signature1.png"
    # sign_filename = "static\images\signatures\signature.jpg"
    pk_filename = "static\images\signatures\container.pfx"
    approval_field = doc.GetField(signatureID)
    approval_signature_digsig_field = DigitalSignatureField(approval_field)
    img = Image.Create(doc.GetSDFDoc(), sign_filename)
    found_approval_signature_widget = SignatureWidget(
        approval_field.GetSDFObj())
    found_approval_signature_widget.CreateSignatureAppearance(img)
    approval_signature_digsig_field.SignOnNextSave(pk_filename, '')
    doc.Save(output_file, SDFDoc.e_incremental)
    summary = {
        "Input File": input_file, "Signature ID": signatureID, 
        "Output File": output_file, "Signature File": sign_filename, 
        "Certificate File": pk_filename
    }
    # print("## Summary ########################################################")
    # print("\n".join("{}:{}".format(i, j) for i, j in summary.items()))
    # print("###################################################################")
    return True

    