import * as z from 'zod';

export const signschema = z.object({
    name:
        z.string()
        .trim()
        .min(3,"minimum length of name should be  3")
        .max(30,"maximum length of name should be 30"),
    age:
        z.coerce
        .number({
            invalid_type_error: "Age must be a number"
        })
        .min(10,"minimum age should be 10")
        .max(100,"max age should be 100")
        .optional(),//if not filled the age then upper case not run
        //in this first verify the email remove space fornt or back convert to lower after that 
        //give z.email to check formating 
    email: z.preprocess(
            (value)=> typeof value == "string" 
            ? value.trim().toLowerCase() 
            :value,
        z.email("email must be valid")
    ),
    password:
        z.string()
        .min(8)
        .max(30)
        .regex(/[A-Z]/,"your password should have atleast One capital letter")
        .regex(/[a-z]/,"your password should have atleast One small letter")
        .regex(/[0-9]/,"your password should have atleast One number letter")
        .regex(/[@!#$%^&*()_+=,.<>/?:;"'{}]/,"your password should have atleast One special letter")

});

// z.preprocess(
//     (value) => {
//         if (value === "" || value === undefined || value === null) {
//             return undefined;
//         }

//         return Number(value);
//     },
//     z.number()

export const loginSchema = z.object({
    email: z.preprocess(
        (value)=> typeof value == "string" ? value.trim().toLowerCase() :value,
        z.email("email must be valid")
    ),
    password:
        z.string()
        .min(8)
        .max(30)
        .regex(/[A-Z]/,"your password should have atleast One capital letter")
        .regex(/[a-z]/,"your password should have atleast One small letter")
        .regex(/[0-9]/,"your password should have atleast One number letter")
        .regex(/[@!#$%^&*()_+=,.<>/?:;"'{}]/,"your password should have atleast One special letter")

})