from django.core.exceptions import ValidationError


class MyValidator:
    def validate_password(self,password, user=None):
        l, u, p, d = 0, 0, 0, 0
        s = password
        capitalalphabets="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        smallalphabets="abcdefghijklmnopqrstuvwxyz"
        specialchar="$@_"
        digits="0123456789"
        if (len(s) >= 8):
            for i in s:
        
                if (i in smallalphabets):
                    l+=1           
        
                if (i in capitalalphabets):
                    u+=1           
        
                if (i in digits):
                    d+=1           
        
                if(i in specialchar):
                    p+=1       
        if (l>=1 and u>=1 and p>=1 and d>=1 and l+p+u+d==len(s)):
            return("Valid Password")
        else:
            # return("Invalid Password")
            raise ValidationError(
                ''' Password should be minimum 8 characters.
                   The alphabet must be between [a-z]
                    At least one alphabet should be of Upper Case [A-Z]
                    At least 1 number or digit between [0-9].
                    At least 1 character from [ _ or @ or $ ].''')
    


    def validate_book(self, price):
        if (price > 0.00):
            return("Valid Price")
        else: 
            raise ValidationError(
                ''' Price should be more than 0.01''')
