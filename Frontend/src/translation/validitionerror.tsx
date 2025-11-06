export const validationErrors = {
	en: {
		first_name_error: "First name must not be empty and contain only letters",
		family_name_error: "Family name must not be empty and contain only letters",
		email_error: 'Email must be a valid email address: ***@gmail.com',
		username_error: "Username should not be empty or have fewer than two characters",
		display_name_error: "Display name should not be empty or have fewer than two characters",
		oldpassowrd_error: "Password must be at least 8 characters without spaces",
		password_error: "Password must be at least 8 characters without spaces",
		confirmpassword_error: "Password must be at least 8 characters without spaces",
	},

	fr: {
		first_name_error: "Le prénom ne doit pas être vide et ne contenir que des lettres",
		family_name_error: "Le nom de famille ne doit pas être vide et ne contenir que des lettres",
		email_error: "L'adresse e-mail doit être une adresse e-mail valide : ***@gmail.com",
		username_error: "Le nom d'utilisateur ne doit pas être vide ou contenir moins de deux caractères",
		display_name_error: "Le nom d'affichage ne doit pas être vide ou contenir moins de deux caractères",
		oldpassowrd_error: "Le mot de passe doit contenir au moins 8 caractères sans espaces",
		password_error: "Le mot de passe doit contenir au moins 8 caractères sans espaces",
		confirmpassword_error: "Le mot de passe doit contenir au moins 8 caractères sans espaces",
	},

	es: {
		first_name_error: "El nombre no debe estar vacío y solo debe contener letras",
		family_name_error: "El apellido no debe estar vacío y solo debe contener letras",
		email_error: "El correo electrónico debe ser una dirección de correo válida: ***@gmail.com",
		username_error: "El nombre de usuario no debe estar vacío ni tener menos de dos caracteres",
		display_name_error: "El nombre para mostrar no debe estar vacío ni tener menos de dos caracteres",
		oldpassowrd_error: "La contraseña debe tener al menos 8 caracteres sin espacios",
		password_error: "La contraseña debe tener al menos 8 caracteres sin espacios",
		confirmpassword_error: "La contraseña debe tener al menos 8 caracteres sin espacios",
	},
};

export default validationErrors;
