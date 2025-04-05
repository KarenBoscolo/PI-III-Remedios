import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text } from '@chakra-ui/react'
import { Footer, Header } from '../../components'
import { Formik, Field, Form, FormikHelpers } from 'formik'
import { IoSearch } from "react-icons/io5"
import * as Yup from 'yup'
import { api } from '../../services/api'
import { toast } from 'react-toastify'

interface FormData {

  cpf: string
  nome: string
  rua: string
  numero: string
  bairro: string
  complemento: string
  cep: string
  cidade: string
  uf: string
  telefone: string
}

const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1")
}

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4,5})(\d{4})/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1")
}

const validateCPF = (cpf: string) => {
  const regex = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}-?[0-9]{2}$/

  if (!regex.test(cpf)) {
    return false
  }
  return true
}

const Patient = () => {
  const initialValues: FormData = {

    cpf: "",
    nome: "",
    rua: "",
    numero: "",
    bairro: "",
    complemento: "",
    cep: "",
    cidade: "",
    uf: "",
    telefone: "",
  }

  const validationSchema = Yup.object({
    cpf: Yup.string().required('CPF é obrigatório').test('cpf', 'CPF inválido', validateCPF),
    nome: Yup.string().required('Nome é obrigatório').matches(/^[^\d]+$/, 'Nome não pode conter números'),
    rua: Yup.string().required('A rua é obrigatória'),
    numero: Yup.string().required('O número é obrigatório'),
    bairro: Yup.string().required('O bairro é obrigatório'),
    complemento: Yup.string(),
    cep: Yup.string().matches(/^[0-9]{5}-?[0-9]{3}$/, 'CEP inválido'),
    cidade: Yup.string().required('A cidade é obrigatória'),
    uf: Yup.string().required('O estado é obrigatório'),
    telefone: Yup.string().required('O telefone é obrigatório').matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido'),
  })

  const zipCodeConsultation = (
    // e: React.FocusEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void,
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void,
    cep: string
  ) => {
    const sanitizedCep = cep.replace(/\D/g, '')

    if (sanitizedCep.length !== 8) return

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then((data: { logradouro?: string; bairro?: string; localidade?: string; uf?: string }) => {
        console.log(data)
        setFieldValue('rua', data.logradouro || '')
        setFieldValue('bairro', data.bairro || '')
        setFieldValue('cidade', data.localidade || '')
        setFieldValue('uf', data.uf || '')
        setFieldTouched('numero', true)

        setTimeout(() => {
          document.getElementById('numero')?.focus()
        }, 100)

      })
      .catch(error => console.error("Erro ao buscar CEP:", error))
  }

  const handleSubmitForm = async (values: FormData, { resetForm }: FormikHelpers<FormData>) => {

    try {
      const { status } = await api.post('/pacientes', values, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (status === 201 || status === 200) {
        toast.success('Paciente cadastrado com sucesso!')
        resetForm()
      }
      if (status === 409) {
        toast.error('Paciente já cadastrado')
      }

    } catch (err) {
      toast.error('Falha no sistema! Tente novamente')
    }
  }

  return (
    <>
      <Header />
      <Box
        height='calc(100vh - 115px)'
        p={8}
      >
        <Heading as="h1" fontWeight="bold" fontSize='xl'>Cadastro de Paciente</Heading>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ errors, setFieldValue, setFieldTouched, values, touched }) => (
            <Form>
              <FormControl mt={7} position='relative'>
                <FormLabel htmlFor='cpf' aria-labelledby="cpf" color='#808080'>CPF do paciente</FormLabel>
                <Field
                  as={Input}
                  id='cpf'
                  name='cpf'
                  type='text'
                  placeholder='Digite o CPF'
                  width='30%'
                  onChange={(e: { target: { value: string } }) => {
                    const maskedCPF = maskCPF(e.target.value)
                    setFieldValue('cpf', maskedCPF)
                  }}
                  value={values.cpf}
                />
                {errors.cpf && touched.cpf && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1} position='absolute' left={0} bottom='-20px'>{errors.cpf}</Text>}
              </FormControl>

              <FormControl mt={7} display='flex' alignItems='center' gap={15}>
                <FormControl position='relative'>
                  <FormLabel htmlFor='nome' aria-labelledby="nome" color='#808080'>Nome do paciente</FormLabel>
                  <Field as={Input} id='nome' name='nome' type='text' placeholder='Digite o nome completo' />
                  {errors.nome && touched.nome && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1} position='absolute' left={0} bottom='-20px'>{errors.nome}</Text>}
                </FormControl>
                <FormControl position='relative'>
                  <FormLabel htmlFor='telefone' aria-labelledby="telefone" color='#808080'>Telefone do paciente</FormLabel>
                  <Field
                    as={Input}
                    id='telefone'
                    name='telefone'
                    type='text'
                    placeholder='Informe o telefone'
                    onChange={(e: { target: { value: string } }) => {
                      const maskedPhone = maskPhone(e.target.value)
                      setFieldValue('telefone', maskedPhone)
                    }}
                    value={values.telefone}
                  />
                  {errors.telefone && touched.telefone && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1} position='absolute' left={0} bottom='-20px'>{errors.telefone}</Text>}
                </FormControl>
              </FormControl>

              <FormControl mt={7}>
                <FormLabel color='#808080'>Endereço do paciente</FormLabel>
                <FormControl display='flex' alignItems='center' gap={15} >
                  <FormControl w='300px' position='absolute'>
                    <Field
                      as={Input}
                      id='cep'
                      name='cep'
                      type='text'
                      placeholder='CEP'
                      data-testid="cep"
                    />
                    {errors.cep && touched.cep && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1} position='absolute' left={0} bottom='-20px'>{errors.cep}</Text>}
                  </FormControl>
                  <Button variant="plain" position='relative' left='250px'
                    onClick={() => zipCodeConsultation(setFieldValue, setFieldTouched, values.cep)}
                  >
                    <IoSearch color='#247ba0' />
                  </Button>
                </FormControl>
              </FormControl>

              <FormControl mt={7}>
                <FormControl display='flex' alignItems='center' gap={15}>
                  <FormControl position='relative'>
                    <Field as={Input} id='rua' name='rua' type='text' placeholder='Informe o endereço completo' data-testid="rua" />
                    {errors.rua && touched.rua && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1} position='absolute' left={0} bottom='-20px'>{errors.rua}</Text>}
                  </FormControl>
                  <FormControl w='350px' position='relative'>
                    <Field as={Input} id='numero' name='numero' type='text' placeholder='Número' data-testid="numero" />
                    {errors.numero && touched.numero && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1} position='absolute' left={0} bottom='-20px'>{errors.numero}</Text>}
                  </FormControl>
                </FormControl>
              </FormControl>

              <FormControl mt={7}>
                <FormControl display='flex' alignItems='center' gap={15}>
                  <FormControl position='relative'>
                    <Field as={Input} id='bairro' name='bairro' type='text' placeholder='Informe o bairro' data-testid="bairro" />
                    {errors.bairro && touched.bairro && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1} position='absolute' left={0} bottom='-20px' >{errors.bairro}</Text>}
                  </FormControl>
                  <FormControl position='relative'>
                    <Field as={Input} id='complemento' name='complemento' type='text' placeholder='Complemento' data-testid="complemento" />
                  </FormControl>
                </FormControl>
              </FormControl>

              <FormControl mt={7}>
                <FormControl display='flex' alignItems='center' gap={15}>
                  <FormControl position='relative'>
                    <Field as={Input} id='cidade' name='cidade' type='text' placeholder='Informe a cidade' data-testid="cidade" />
                    {errors.cidade && touched.cidade && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1} position='absolute' left={0} bottom='-20px'>{errors.cidade}</Text>}
                  </FormControl>
                  <FormControl w='350px' position='relative'>
                    <Field as={Input} id='uf' name='uf' type='text' placeholder='Informe o UF' data-testid="uf" />
                    {errors.uf && touched.uf && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1} position='absolute' left={0} bottom='-20px'>{errors.uf}</Text>}
                  </FormControl>
                </FormControl>
              </FormControl>

              <Flex justify={'flex-end'}>
                <Button mt={14} variant='outline' type='submit' colorScheme='blue' width='20%'>Cadastrar</Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
      <Footer />
    </>
  )
}

export default Patient