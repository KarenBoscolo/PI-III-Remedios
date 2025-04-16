import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Select, Text } from '@chakra-ui/react'
import { Header } from '../../components'
import { Formik, Field, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { api } from '../../services/api'
import { toast } from 'react-toastify'

interface FormData {
  formula: string
  quantidade: number
  tarja: 'SEM_TARJA' | 'AMARELA' | 'VERMELHA' | 'PRETA' | ""
  vencimento: string
}

const Medicament = () => {
  const initialValues: FormData = {
    formula: "",
    quantidade: 0,
    tarja: "",
    vencimento: ""
  }

  const validationSchema = Yup.object({
    formula: Yup.string().required('Nome do medicamento é obrigatório'),
    quantidade: Yup.number().required('A quantidade é obrigatória'),
    tarja: Yup.string().required('A tarja é obrigatória'),
    vencimento: Yup.string().required('Data de vencimento é obrigatória'),
  })

  const handleSubmitForm = async (values: FormData, { resetForm }: FormikHelpers<FormData>) => {

    try {
      const { status } = await api.post('/medicamentos', values, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (status === 201 || status === 200) {
        toast.success('Medicamento cadastrado com sucesso!')
        resetForm()
      }
      if (status === 409) {
        toast.error('Medicamento já cadastrado')
      }

    } catch (err) {
      toast.error('Falha no sistema! Tente novamente')
    }
  }

  return (
    <>
      <Header />
      <Box
        height='calc(100vh - 75px)'
        p={8}
      >
        <Heading as="h1" fontWeight="bold" fontSize='xl'>Cadastro de Medicamentos</Heading>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ errors, touched }) => (
            <Form>
              <FormControl mt={7} h='80px'>
                <FormLabel htmlFor='formula' color='#808080'>Medicamento</FormLabel>
                <Field
                  as={Input}
                  id='formula'
                  name='formula'
                  type='text'
                  placeholder='Digite o nome do medicamento'
                  _focus={{
                    borderColor: "gray.700",
                    boxShadow: "none",
                  }}
                />
                {errors.formula && touched.formula && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1}>{errors.formula}</Text>}
              </FormControl>
 
              <FormControl mt={7} h='80px'>
                <FormLabel htmlFor='tarja' color='#808080'>Tarja</FormLabel>
                <Field 
                  as={Select}
                  id="tarja" 
                  name="tarja" 
                  _focus={{
                    borderColor: "gray.700",
                    boxShadow: "none",
                  }}
                >
                  <option value="">Selecione a tarja...</option>
                  <option value="SEM_TARJA">Sem tarja</option>
                  <option value="AMARELA">Amarela</option>
                  <option value="VERMELHA">Vermelha</option>
                  <option value="PRETA">Preta</option>
                </Field>
                {errors.tarja && touched.tarja && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1}>{errors.tarja}</Text>}
              </FormControl>

              <FormControl mt={7} h='80px'>
                <FormLabel htmlFor='quantidade' color='#808080'>Quantidade</FormLabel>
                <Field
                  as={Input}
                  id='quantidade'
                  name='quantidade'
                  type='number'
                  placeholder='Digite a quantidade'
                  _focus={{
                    borderColor: "gray.700",
                    boxShadow: "none",
                  }}
                  width='30%'
                />
                {errors.quantidade && touched.quantidade && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1}>{errors.quantidade}</Text>}
              </FormControl>

              <FormControl mt={7} h='80px'>
                <FormLabel htmlFor='vencimento' color='#808080'>Data do vencimento</FormLabel>
                <Field
                  as={Input}
                  id='vencimento'
                  name='vencimento'
                  type='date'
                  width='30%'
                  _focus={{
                    borderColor: "gray.700",
                    boxShadow: "none",
                  }}
                />
                {errors.vencimento && touched.vencimento && <Text color='#ff0000' fontSize={14} fontWeight='500' pl={1}>{errors.vencimento}</Text>}
              </FormControl>

              <Flex justify={'flex-end'}>
                <Button
                  bg="#00834F"
                  color="#FFF"
                  width='20%'
                  mt="160px"
                  fontWeight="bold"
                  type='submit'
                  _hover={{
                    color: "#00834F",
                    bg: "transparent",
                    border: "1px solid #00834F"
                  }}
                >Cadastrar
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>  
    </>
  )
}

export default Medicament