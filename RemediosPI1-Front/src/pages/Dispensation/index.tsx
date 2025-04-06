import {
  Box, Flex, FormControl, FormLabel, Input,
  Select, Text, Table, Thead, Tbody, Tr, Th, Td,
  TableContainer, Button, Tooltip, OrderedList, ListItem,
  Image, Heading
} from '@chakra-ui/react'
import { Formik, Form, FormikHelpers, Field } from 'formik'
import { Header, MultSelect, BaseModal } from '../../components'
import { MdDeleteOutline } from 'react-icons/md'
import { toast } from 'react-toastify'
import { api } from '../../services/api'
import { useEffect, useState } from 'react'
import * as Yup from "yup"
import LogoRemedioSolidario from '../../assets/logo-preto.png'

interface FormData {
  data: string
  paciente: FormPatients
  medicamento: FormMedicaments | undefined
  quantidade: number
}

interface FormPatients {
  id: string
  cpf: string
  nome: string
  rua: string
  numero: string
  bairro: string
  complemento: string
  cidade: string
  uf: string
  cep: string
}

interface FormMedicaments {
  id: string
  formula: string
  quantidade: number
  vencimento: string
}

interface ModalData {
  data: string
  paciente: FormPatients
  medicamentos: FormMedicaments[]
  medicamentoList: FormMedicaments[],
  endereco: string
}

const validationSchema = Yup.object().shape({
  paciente: Yup.object().shape({
    id: Yup.string().required("Selecione um paciente"),
    cpf: Yup.string(),
    nome: Yup.string(),
  }).required("Selecione um paciente"),
  medicamento: Yup.object().shape({
    id: Yup.string(),
    formula: Yup.string(),
    quantidade: Yup.number().required("Selecione pelo menos um medicamento"),
    vencimento: Yup.string(),
  }).required("Selecione pelo menos um medicamento"),
  endereco: Yup.string(),
})

const Dispensation = () => {
  const [patients, setPatients] = useState<FormPatients[]>([])
  const [itemList, setItemList] = useState<FormMedicaments[]>([])
  const [tableItems, setTableItems] = useState<FormMedicaments[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [modalData, setModalData] = useState<ModalData | null>(null)
  const [message, setMessage] = useState('')

  const getDate = () => {
    const currentDate = new Date()
    return currentDate.toISOString().slice(0, 10)
  }

  const initialValues: FormData = {
    data: getDate(),
    paciente: {
      id: '',
      cpf: '',
      nome: '',
      rua: '',
      numero: '',
      bairro: '',
      complemento: '',
      cidade: '',
      uf: '',
      cep: '',
    },
    medicamento: undefined,
    quantidade: 0
  }

  const formattedDate = (data: string) => {
    const currentDate = new Date(data)
    const formattedDate = currentDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    })
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
  }

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/pacientes')
        console.log('data patients: ', response.data)
        setPatients(response.data)
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error)
      }
    }
    fetchPatients()
  }, [])

  useEffect(() => {
    const fetchMedicaments = async () => {
      try {
        const response = await api.get('/medicamentos')
        setItemList(response.data)
      } catch (error) {
        console.error('Erro ao buscar medicamentos:', error)
      }
    }
    fetchMedicaments()
  }, [])

  const handleAddMedicaments = (formula: FormMedicaments, event: { preventDefault: () => void }) => {
    event.preventDefault()

    const existingItem = tableItems.find((item) => item.id === formula.id)

    if (existingItem) {
      toast.error('Este medicamento já foi adicionado.')
      return
    }

    const newItem: FormMedicaments = {
      id: formula.id,
      formula: formula.formula,
      quantidade: formula.quantidade,
      vencimento: formula.vencimento
    }
    setTableItems([...tableItems, newItem])
  }

  const handleDeleteMedicament = (id: string) => {
    try {
      setTableItems(tableItems.filter(formula => formula.id !== id))
    } catch (error) {
      console.error('Erro ao excluir paciente:', error)
    }
  }

  const handleModalClose = () => {
    setIsEditModalOpen(false)
    setModalData(null)
  }

  const handlePrint = () => {
    window.print()
    setIsEditModalOpen(false)
  }

  const handleSubmitForm = async (values: FormData, { resetForm }: FormikHelpers<FormData>) => {
    const { paciente } = values
    if (tableItems.length !== 0) {
      try {
        const postData = {
          data: new Date().toISOString().slice(0, 10),
          paciente,
          medicamentos: tableItems
        }

        const { status } = await api.post('/prescricoes', postData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (status === 201 || status === 200) {
          const endereco = `${postData.paciente.rua}, ${postData.paciente.numero} - ${postData.paciente.bairro}, ${postData.paciente.cidade} - ${postData.paciente.uf}, ${postData.paciente.cep}`

          setPatients([])

          setTableItems([])
          resetForm()

          setIsEditModalOpen(true)
          setModalData({
            ...postData,
            medicamentoList: postData.medicamentos,
            endereco: endereco
          })

        }
        if (status === 409) {
          toast.error('Envie novamente')
        }

      } catch (err) {
        toast.error('Falha no sistema! Tente novamente')
      }
    }
  }

  return (
    <>
      <Header />
      <Box
        height='calc(100vh - 75px)'
        p={8}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmitForm}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue, touched, errors }) => {
            return (
              <Form>
                <Flex alignItems='center' justify='space-between'>
                  <Heading as="h1" fontWeight='bold' fontSize='xl'>Dispensação de Medicamentos</Heading>
                  <FormControl w='300px'>
                    <Input
                      textAlign="right"
                      color='#808080'
                      name='date'
                      variant='unstyled'
                      value={formattedDate(values.data)}
                      onChange={e => {
                        setFieldValue('date', e.target.value)
                      }}
                    />
                  </FormControl>
                </Flex>
                <FormControl mt={7} h='80px'>
                  <FormLabel htmlFor='paciente' color='#808080'>Paciente</FormLabel>
                  <Select
                    id='paciente'
                    name='paciente'
                    placeholder='Selecione o nome do paciente'
                    _focus={{
                      borderColor: "gray.700",
                      boxShadow: "none"
                    }}
                    w='73%'
                    onChange={e => {
                      const paciente = patients.find(patient => patient.id === e.target.value)
                      setFieldValue('paciente', paciente)
                    }}
                  >
                    {patients && patients.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.nome}</option>
                    ))}
                  </Select>
                  {errors.paciente && touched.paciente && (
                    <Text
                      color="#ff0000"
                      fontSize={14}
                      fontWeight="500"
                      pl={1}
                      position="absolute"
                    >
                      Selecione um paciente
                    </Text>
                  )}
                </FormControl>

                <Flex mt={5} gap={6} w='92%'>
                  <FormControl>
                    <FormLabel htmlFor="medicamento" color='#808080'>Digite o nome do medicamento</FormLabel>
                    <MultSelect
                      inputValue={inputValue}
                      name='medicamento'
                      options={itemList.map(item => item.formula)}
                      onChange={(selectedOption: string) => {
                        const option = itemList.find((item) => item.formula === selectedOption)
                        setFieldValue('medicamento', option)
                        setInputValue(selectedOption)
                      }}
                    />
                    {errors.medicamento && touched.medicamento && (
                      <Text
                        color="#ff0000"
                        fontSize={14}
                        fontWeight="500"
                        pl={1}
                        position="absolute"
                      >
                        Selecione pelo menos um medicamento
                      </Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="quantidade" color='#808080'>Quantidade</FormLabel>
                    <Field
                      as={Input}
                      id='quantidade'
                      type="number"
                      name="quantidade"
                      placeholder="Quantidade"
                      _focus={{
                        borderColor: "gray.700",
                        boxShadow: "none",
                      }}
                      value={values.quantidade || ''}
                    />
                    {message !== '' && (
                      <Text
                        color="#ff0000"
                        fontSize={14}
                        fontWeight="500"
                        pl={1}
                        position="absolute"
                      >
                        {message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl display='flex' alignItems='flex-end'>
                    <Button
                      name="adicionar"
                      type='button'
                      onClick={(e) => {
                        if (values.quantidade === 0) setMessage("Selecione a quantidade do medicamento")
                        if (values.medicamento && values.quantidade !== 0) {

                          handleAddMedicaments({ ...values.medicamento, quantidade: values.quantidade }, e)
                          setInputValue('')
                          setFieldValue('quantidade', 0)
                          setMessage('')
                        }
                      }}
                    >Adicionar</Button>
                  </FormControl>
                </Flex>

                <Box height="20vh" overflowY="auto" mt={7}>
                  <TableContainer>
                    <Table variant='simple' size='sm'>
                      <Thead>
                        <Tr>
                          <Th>Medicamento</Th>
                          <Th>Quantidade</Th>
                          <Th></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {tableItems.map((item, index) => (
                          <Tr key={index}>
                            <Td>{item.formula}</Td>
                            <Td>{item.quantidade}</Td>
                            <Td>
                              <Flex justify={'end'}>
                                <Tooltip label='Excluir' fontSize='md' placement='top'>
                                  <Button onClick={() => handleDeleteMedicament(item.id)}>
                                    <MdDeleteOutline />
                                  </Button>
                                </Tooltip>
                              </Flex>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
                <Flex justify={'flex-end'}>
                  <Button
                    bg="#00834F"
                    color="#FFF"
                    width='20%'
                    mt="200px"
                    fontWeight="bold"
                    _hover={{
                      color: "#00834F",
                      bg: "transparent",
                      border: "1px solid #00834F"
                    }}
                    type='submit'
                  > Dispensar
                  </Button>
                </Flex>
              </Form>
            )
          }}
        </Formik>
      </Box>

      <BaseModal
        size='xl'
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        showCloseButton={false}
        modalFooter={
          <Button
            type="submit"
            colorScheme="blue"
            mt={3}
            bg="#00834F"
            color="#FFF"
            _hover={{
              color: "#00834F",
              bg: "transparent",
              border: "1px solid #00834F"
            }}
            onClick={handlePrint}
            display={['none', 'block']}
          >
            Imprimir
          </Button>}
      >
        <Flex
          w='100%'
          h='70px'
          p={2}
          alignItems='center'
          justify='center'
          bg='#808080'
          borderRadius={2}
          aria-label='Logo Projeto Remédio'
          role='img'
        >
          <Image
            src={LogoRemedioSolidario}
            alt="Logo Projeto Remédio"
            w='auto' h='50px'
            width='auto'
            height='50px'
          />
        </Flex>
        <Box>
          <Flex p={5} justify='center'>
            <Text fontWeight="bold" fontSize="lg" >Dispensação de Medicamentos</Text>
          </Flex>
          <Box position="relative" border='1px' p={3} py='4' borderColor='#808080' borderRadius={2} mb={4}>
            <Box
              position="absolute"
              top="-15px"
              left="15%"
              transform="translateX(-50%)"
              backgroundColor="#fff"
              px={1}
              fontSize="md"
              fontWeight="bold"
            >
              Dados do Paciente
            </Box>
            <Flex>
              <FormControl display='flex' alignItems='center'>
                <FormLabel mb={0}>NOME:</FormLabel>
                <Input type="text" name="nome" value={modalData?.paciente.nome} variant='unstyled' isReadOnly />
              </FormControl>
              <FormControl display='flex' alignItems='center'>
                <FormLabel mb={0}>CPF:</FormLabel>
                <Input type="text" name="cpf" value={modalData?.paciente.cpf} variant='unstyled' isReadOnly />
              </FormControl>
            </Flex>
            <Flex>
              <FormControl display='flex' alignItems='center'>
                <FormLabel mb={0}>ENDEREÇO:</FormLabel>
                <Input w='800px' type="text" name="endereco" value={modalData?.endereco} variant='unstyled' isReadOnly />
              </FormControl>
            </Flex>
          </Box>
          <Flex justify='space-between' border='1px' p={3} borderColor='#808080' borderRadius={2} mb={6} >
            <Text fontWeight="bold" fontSize="md" >Medicamentos</Text>
            <FormControl display='flex' alignItems='center' mb={0} w='140px'>
              <FormLabel mb={0}>Data:</FormLabel>
              <Input type="text" name="data" value={modalData?.data} variant='unstyled' isReadOnly />
            </FormControl>
          </Flex>
          <OrderedList ml={6}>
            {modalData?.medicamentoList.map((medicamento, id) => (
              <ListItem key={id}>
                <Flex>
                  <Input type="text" value={medicamento.formula} w='70%' variant='unstyled' isReadOnly />
                  <Flex >
                    <Input type="text" value={medicamento.quantidade} w='15%' variant='unstyled' alignContent='' isReadOnly />
                    <Text fontSize="sm" >UN - Comprimidos/Capsulas</Text>
                  </Flex>
                </Flex>
              </ListItem>
            ))}
          </OrderedList>
        </Box>
      </BaseModal>
    </>
  )
}

export default Dispensation