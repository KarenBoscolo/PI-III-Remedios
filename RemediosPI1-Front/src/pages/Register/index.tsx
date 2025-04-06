import Logo from "../../assets/logo.png"
import Background from "../../assets/background.jpg"

import {
  Flex,
  Button,
  Image,
  FormControl,
  FormLabel,
  Input,
  Box,
  Text,
  Link,
  VisuallyHidden,
  Heading,
} from "@chakra-ui/react"
import { Field, Form, Formik, FormikHelpers } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import { api } from "../../services/api"

interface FormData {
  nomeUsuario: string
  email: string
  senha: string
}

export default function Register() {
  const navigate = useNavigate()

  const initialValues: FormData = {
    nomeUsuario: "",
    email: "",
    senha: "",
  }

  const validationSchema = Yup.object({
    nomeUsuario: Yup.string()
      .required("O nome é obrigatório")
      .matches(/^[^\d]+$/, "Nome não pode conter números"),
    email: Yup.string()
      .email("Digite um e-mail válido")
      .required("O e-mail é obrigatório"),
    senha: Yup.string()
      .required("A senha é obrigatória")
      .min(6, "A senha deve conter 6 digitos"),
  })

  const handleSubmitRegister = async (
    values: FormData,
    { resetForm }: FormikHelpers<FormData>
  ) => {
    try {

      const { status, data } = await api.post("cadastro", values).then((response) => {
        return response
      }).catch((error) => {
        console.log(error)
        return error.response
      })
      console.log(status)

      if (data === 'Nome de usuário já existe!')
        toast.error("Nome de usuário já existe!")

      if (status === 201 || status === 200) {
        toast.success("Usuário cadastrado com sucesso!")
        resetForm()
        navigate("/")
      }
    } catch (err) {
      toast.error("Erro ao cadastrar o usuário. Tente novamente.")
    }
  }

  return (
    <>
      <Flex
        height="100vh"
        justify="center"
        align="center"
        bgImage={`url(${Background})`}
        bgPosition="center"
        bgSize="cover"
        bgRepeat="no-repeat"
      >
        <Box
          boxSize="lg"
          bg="#FFF"
          p="10"
          borderRadius="md"
          boxShadow="md"
          position="relative"
          opacity='0.9'
        >
          <VisuallyHidden>
            <Heading as="h1">Criar Conta</Heading>
          </VisuallyHidden>
          <Image
            src={Logo}
            alt="Logo Ecum Detailing"
            boxSize="80px"
            margin="0 auto"
            height="80px"
          />

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmitRegister}
          >
            {({ errors, touched }) => (
              <Form noValidate>
                <Flex flexDirection="column" gap="35px">
                  <FormControl h="60px">
                    <FormLabel htmlFor="nomeUsuario" aria-labelledby="nomeUsuario" color="#00834F">
                      Nome
                    </FormLabel>
                    <Field
                      as={Input}
                      id="nomeUsuario"
                      name="nomeUsuario"
                      type="text"
                      autoComplete="current-name"
                      placeholder="Digite seu nome"
                      _focus={{
                        borderColor: "gray.700",
                        boxShadow: "none",
                      }}
                      sx={{
                        "::placeholder": {
                          color: "gray.700",
                        },
                      }}
                    />
                    {errors.nomeUsuario && touched.nomeUsuario && (
                      <Text
                        color="#8f1515"
                        fontSize={14}
                        fontWeight="500"
                        pl={1}
                      >
                        {errors.nomeUsuario}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl h="60px">
                    <FormLabel htmlFor="email" aria-labelledby="email" color="#00834F">
                      E-mail
                    </FormLabel>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Digite seu e-mail"
                      _focus={{
                        borderColor: "gray.700",
                        boxShadow: "none",
                      }}
                      sx={{
                        "::placeholder": {
                          color: "gray.700",
                        },
                      }}
                    />
                    {errors.email && touched.email && (
                      <Text
                        color="#8f1515"
                        fontSize={14}
                        fontWeight="500"
                        pl={1}
                      >
                        {errors.email}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl h="60px">
                    <FormLabel htmlFor="senha" aria-labelledby="senha" color="#00834F">
                      Senha
                    </FormLabel>
                    <Field
                      as={Input}
                      id="senha"
                      name="senha"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Digite sua senha"
                      _focus={{
                        borderColor: "gray.700",
                        boxShadow: "none",
                      }}
                      sx={{
                        "::placeholder": {
                          color: "gray.700",
                        },
                      }}
                    />
                    {errors.senha && touched.senha && (
                      <Text
                        color="#8f1515"
                        fontSize={14}
                        fontWeight="500"
                        pl={1}
                      >
                        {errors.senha}
                      </Text>
                    )}
                  </FormControl>

                  <Flex direction="column" align="center">
                    <Button
                      type="submit"
                      bg='#00834F'
                      color="#FFF"
                      width="150px"
                      mt="5px"
                      fontWeight="bold"
                      _hover={{
                        color: "#00834F",
                        bg: "transparent",
                        border: "1px solid #00834F"
                      }}
                    >
                      Cadastrar
                    </Button>

                    <Text
                      color="#00834F"
                      fontSize="sm"
                      mt="10px"

                      bottom="30px"
                      right="45px"
                    >
                      Já possuo cadastro! { }
                      <Link as={RouterLink} to="/" fontWeight="bold">
                        Entrar
                      </Link>
                    </Text>
                  </Flex>
                </Flex>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </>
  )
}
