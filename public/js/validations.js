window.onload = async () => {
    //se obtiene que se va a validar (login, etc) desde los atributos en la inclusion del script en el html
    let view_name = document.getElementById("validations").getAttribute("view_name"); 
    //se obtiene la clase del formulario que se va a validar desde los atributos en la inclusion del script en el html
    let form_name = document.getElementById("validations").getAttribute("form_name");

    let form = document.querySelector(`form.${form_name}`); //se obtiene el formulario a validar

    //prefijo para saber que estas validaciones son de frontend y no de backend. Dejar como "" en producción
    let prefijo = "Validación Front: ";     

    //todos los tipos de validaciones de todos los campos posibles
    let optional = (input) =>  validator.isLength(input.value,{max: 0}); //como es opcional, no realizo la validacion si el campo está vacío

    let fieldsValidations = {
        /* Validaciones de usuario para registro, login y crud de usuarios*/
        email: {
            name: "email",
            validations: [{
                validation:(input) => validator.isLength(input.value,{min: 1}), //no existe isNotEmpty en validator js
                errorMsg: prefijo +"No ingresó ningún email"
            },
            {
                validation:(input) => validator.isEmail(input.value),
                errorMsg: prefijo + "Debe ingresar un email válido"
            },
            {
                validation:(input) => validator.isLength({max: 45}),
                errorMsg: prefijo + "El email puede tener hasta 45 caracteres"
            }            
            ]
        },
        password: 
        {
            name: "password",
            validations:[
                {
                    validation:(input) => validator.isLength(input.value,{min: 1}),
                    errorMsg: prefijo + "No ingresó ninguna contraseña"
                },
                {
                    validation:(input) => validator.isLength(input.value,{min: 8, max: 45}),
                    errorMsg: prefijo + "La contraseña debe tener entre 8 y 45 caracteres"
                }
                
            ]//TODO: validacion de passwordRepeat

        },
        firstName:
        {
            name: "firstName",
            validations: [
                {
                    validation:(input) => validator.isLength(input.value,{min: 1}),
                    errorMsg: prefijo + "No ingresó ningún nombre"
                },
                {
                    validation:(input) => validator.isAlpha(input.value,'es-ES', {ignore: ' '}),
                    errorMsg: prefijo + "El nombre no puede tener números ni caracteres especiales"
                },
                {
                    validation:(input) => validator.isLength(input.value,{min: 2, max: 45}),
                    errorMsg: prefijo + "El nombre debe tener entre 2 y 45 caracteres"
                }
            ]
        },
        lastName:
        {
            name: "lastName",
            validations: [
                {
                    validation:(input) => validator.isLength(input.value,{min: 1}),
                    errorMsg: prefijo + "No ingresó ningún apellido"
                },
                {
                    validation:(input) => validator.isAlpha(input.value,'es-ES', {ignore: ' '}),
                    errorMsg: prefijo + "El apellido no puede tener números ni caracteres especiales"
                },
                {
                    validation:(input) => validator.isLength(input.value,{min: 2, max: 45}),
                    errorMsg: prefijo + "El apellido debe tener entre 2 y 45 caracteres"
                }
            ]
        },
        birthday:
        {
            name: "birthday",
            validations: [
                {   //como es opcional, no realizo la validacion si el campo está vacío
                    validation:(input) => optional(input) || validator.isDate(input.value), 
                    errorMsg: prefijo + "Debe ingresar una fecha"
                }
            ]
        },
        address:
        {
            name: "address",
            validations: [
                {   //como es opcional, no realizo la validacion si el campo está vacío
                    validation:(input) => optional(input) || validator.isAlphanumeric(input.value,'es-ES', {ignore: ' '}), 
                    errorMsg: prefijo + "La dirección no puede tener caracteres especiales"
                },
                {   //como es opcional, no realizo la validacion si el campo está vacío
                    validation:(input) => optional(input) || validator.isLength(input.value,{max: 45}), 
                    errorMsg: prefijo + "La dirección puede tener hasta 45 caracteres"
                }
            ]
        },
        zipCode:
        {
            name: "zipCode",
            validations: [
                {   //como es opcional, no realizo la validacion si el campo está vacío
                    validation:(input) => optional(input) || validator.isAlphanumeric(input.value), 
                    errorMsg: prefijo + "El código postal no puede tener caracteres especiales ni espacios"
                },
                {   //como es opcional, no realizo la validacion si el campo está vacío
                    validation:(input) => optional(input) || validator.isLength(input.value,{min: 4, max: 8}), 
                    errorMsg: prefijo + "El código postal debe tener entre 4 y 8 caracteres"
                }
            ]
        },
        location:
        {
            name: "location",
            validations: [
                {   //como es opcional, no realizo la validacion si el campo está vacío
                    validation:(input) => optional(input) || validator.isAlpha(input.value, 'es-ES', {ignore: ' '}), 
                    errorMsg: prefijo + "La localidad no puede tener números ni caracteres especiales"
                },
                {   //como es opcional, no realizo la validacion si el campo está vacío
                    validation:(input) => optional(input) || validator.isLength(input.value,{max: 45}), 
                    errorMsg: prefijo + "La localidad puede tener hasta 45 caracteres"
                }
            ]
        },
        province:
        {
            name: "province",
            validations: [
                {   //como es opcional, no realizo la validacion si el campo está vacío
                    validation:(input) => optional(input) || validator.isAlpha(input.value, 'es-ES', {ignore: ' '}), 
                    errorMsg: prefijo + "La provincia no puede tener números ni caracteres especiales"
                },
                {   //como es opcional, no realizo la validacion si el campo está vacío
                    validation:(input) => optional(input) || validator.isLength(input.value,{max: 45}), 
                    errorMsg: prefijo + "La provincia puede tener hasta 45 caracteres"
                }
            ]
        },
        phone://TODO validacion de phone 
        {
            name: "phone",
            validations: [
                {   //como es opcional, no realizo la validacion si el campo está vacío
                    validation:(input) => optional(input) || validator.isNumeric(input.value,{ignore: ' '}), 
                    errorMsg: prefijo + "El teléfono no puede tener letras"
                },
                {   //como es opcional, no realizo la validacion si el campo está vacío
                    validation:(input) => optional(input) || validator.isLength(input.value,{min: 8, max: 15}), 
                    errorMsg: prefijo + "El teléfono debe tener entre 8 y 15 caracteres"
                }
            ]
        }           
        
    };

    //Para cada tipo de vista, que campos se van a validar
    //La key debe coincidir con el valor pasado por parámetro en view_name
    let formTypes = {
        login: [
            fieldsValidations.email,
            fieldsValidations.password
        ],
        register: [
            fieldsValidations.firstName,
            fieldsValidations.lastName,
            fieldsValidations.email,
            fieldsValidations.password
        ],

        user: []
    };

    formTypes.user = [
        ...formTypes.register,
        fieldsValidations.birthday,
        fieldsValidations.address,
        fieldsValidations.zipCode,        
        fieldsValidations.location,
        fieldsValidations.province,
        fieldsValidations.phone
    ]
    
    //
    form.addEventListener("submit", function(e){  
        
        //se elige con view_name el tipo de vista a validar y se itera por los campos que se van a validar
        formTypes[view_name].forEach(fieldValidation => {
            let input = document.querySelector(`input[name=${fieldValidation.name}]`);
            let error = document.querySelector(`span.errors[name=${fieldValidation.name}]`);

            //Para el campo a validar, se itera por todas las validaciones de ese campo en específico
            fieldValidation.validations.every(validation => { //every es como foreach pero se detiene al retornar false
                if(!validation.validation(input)){ //compruebo el valor ingresado con respecto a la validacion 
                    error.innerHTML = validation.errorMsg; //se muestra el error de validacion
                    e.preventDefault();
                    return false;   //ya no se comprueban las demás validaciones de este campo como se hacía con el bail()
                }else{
                    error.innerHTML = "";//borro los errores que pueden existir de una anterior ejecución
                    return true;   //se sigue comprobando las demás validaciones de este campo
                }
            });
        });

    });





}