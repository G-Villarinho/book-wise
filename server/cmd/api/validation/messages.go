package validation

var ValidationMessages = map[string]string{
	"required":        "Este campo é obrigatório. Por favor, preencha o valor corretamente.",
	"email":           "O formato do e-mail informado está inválido. Certifique-se de que está no formato correto (exemplo@dominio.com).",
	"min":             "O valor informado é muito curto. O mínimo permitido é de {0} caracteres.",
	"max":             "O valor informado excede o limite máximo de caracteres permitidos. O máximo permitido é de {0} caracteres.",
	"eqfield":         "Os valores dos campos não coincidem. Verifique se você digitou corretamente ambos os campos.",
	"gt":              "O valor informado deve ser maior que zero. Por favor, insira um valor válido.",
	"datetime":        "O formato da data informado está incorreto. Por favor, use o formato válido (dd/mm/aaaa).",
	StrongPasswordTag: "A senha deve ter no mínimo 8 caracteres, conter uma letra maiúscula, um número e um caractere especial (como @, #, $, etc.).",
	PhoneFormatTag:    "O formato do número de telefone está inválido. Utilize o formato correto: (99) 99999-9999.",
}
