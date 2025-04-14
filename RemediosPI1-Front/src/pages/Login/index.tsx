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
import { api } from "../../services/api"
import { useUser } from "../../hooks/UserContext"
import { Link as RouterLink } from "react-router-dom"
import { useNavigate } from "react-router-dom"

interface FormData {
  email: string
  senha: string
}

export default function Login() {
  const { putUserData } = useUser()
  const navigate = useNavigate()

  const initialValues: FormData = {
    email: "",
    senha: "",
  }

  const validationSchema = Yup.object({
    email: Yup.string().required("O login é obrigatório"),
    senha: Yup.string()
      .required("A senha é obrigatória")
      .min(6, "A senha deve conter 6 digitos"),
  })

  const handleSubmitLogin = async (
    values: FormData,
    { resetForm }: FormikHelpers<FormData>
  ) => {
    try {

      const response = await api.get(`cadastro?email=${values.email}&senha=${values.senha}`)

      if (response.status == 200) {
        toast.success("Seja bem-vindo(a)!")

        const user = response.data

        putUserData(user)

        setTimeout(() => {
          localStorage.setItem(
            "remediosolidario:userLogin",
            JSON.stringify(user)
          )
          resetForm()
          navigate("/home/paciente")
        }, 1500)
      }

      else {
        toast.error("Usuário não encontrado!")
        return
      }

    } catch (err) {
      toast.error("Falha no sistema! Tente novamente")
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
        <Box boxSize="md" bg="#FFF" p="10" borderRadius="md" boxShadow="md" opacity='0.9'>
          <VisuallyHidden>
            <Heading as="h1">Login</Heading>
          </VisuallyHidden>
          <Image
            src={Logo}
            alt="Logo Remédio Solidário"
            boxSize="80px"
            mb="8"
            margin="0 auto"
            width="80px"
            height="80px"
          />

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmitLogin}
          >
            {({ errors, touched }) => (
              <Form noValidate>
                <FormControl h="60px">
                  <FormLabel htmlFor="email" aria-labelledby="email" color="#00834F">
                    Login
                  </FormLabel>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="login"
                    color="#fff"
                    autoComplete="username"
                    placeholder="Digite o e-mail cadastrado"
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
                    <Text color="#8f1515" fontSize={14} fontWeight="500" pl={1}>
                      {errors.email}
                    </Text>
                  )}
                </FormControl>

                <FormControl mt={10} h="60px">
                  <FormLabel htmlFor="senha" aria-labelledby="senha" color="#00834F" >
                    Senha
                  </FormLabel>
                  <Field
                    as={Input}
                    id="senha"
                    name="senha"
                    type="password"
                    color="#fff"
                    autoComplete="current-password"
                    placeholder="Digite a senha"
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
                    <Text color="#8f1515" fontSize={14} fontWeight="500" pl={1}>
                      {errors.senha}
                    </Text>
                  )}
                </FormControl>

                <Flex direction="column" align="center">
                  <Button
                    type="submit"
                    color="#FFF"
                    bg='#00834F'
                    width="150px"
                    mt="50px"
                    fontWeight="bold"
                    _hover={{
                      color: "#00834F",
                      bg: "transparent",
                      border: "1px solid #00834F"
                    }}
                  >
                    Entrar
                  </Button>

                  <Text color="#00834F" fontSize="sm" mt="20px">
                    Não possui conta?{" "}
                    <Link as={RouterLink} to="cadastro" fontWeight="bold">
                      Criar conta
                    </Link>
                  </Text>
                </Flex>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </>
  )
}
