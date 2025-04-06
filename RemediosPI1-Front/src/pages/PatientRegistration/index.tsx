import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Flex,
  Tooltip,
  Input,
  FormControl,
  FormLabel,
  Heading,
} from "@chakra-ui/react"
import { Header, BaseModal, Pagination } from "../../components"
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md"
import { api } from "../../services/api"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
interface FormData {
  id: number
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

const PatientRegistration = () => {
  const [patients, setPatients] = useState<FormData[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [_selectedPatient, setSelectedPatient] = useState<FormData | null>(null)
  const [editedPatient, setEditedPatient] = useState<FormData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [patientsPerPage] = useState(5)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/pacientes")
        setPatients(response.data)
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error)
      }
    }

    fetchData()
  }, [])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const getCurrentPatients = () => {
    const indexOfLastPatient = currentPage * patientsPerPage
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
    return patients.slice(indexOfFirstPatient, indexOfLastPatient)
  }

  const handleEditPatient = (patient: FormData) => {
    setSelectedPatient(patient)
    setEditedPatient({ ...patient })
    setIsEditModalOpen(true)
  }

  const handleModalClose = () => {
    setIsEditModalOpen(false)
    setSelectedPatient(null)
    setEditedPatient(null)
  }

  const handleDeletePatient: (id: number) => void = async (id: number) => {
    try {
      await api.delete(`/pacientes/${id}`)
      setPatients(patients.filter((patient) => patient.id !== id))
    } catch (error) {
      console.error("Erro ao excluir paciente:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editedPatient) {
      const updatedPatient = {
        ...(editedPatient as FormData),
        [name]: value,
      }
      setEditedPatient(updatedPatient)
    }
  }

  const handleSubmit = async () => {
    if (editedPatient) {
      try {
        await api.put(`/pacientes/${editedPatient.id}`, editedPatient)
        setPatients(
          patients.map((patient) =>
            patient.id === editedPatient.id ? editedPatient : patient
          )
        )
        setIsEditModalOpen(false)
        setSelectedPatient(null)
        setEditedPatient(null)
        toast.success("Dados atualizados com sucesso!")
      } catch (err) {
        toast.error("Erro ao atualizar paciente!")
      }
    }
  }

  return (
    <>
      <Header />
      <Flex direction="column" height="calc(100vh - 75px)" p={8}>
        <Heading as="h1" fontWeight="bold" fontSize="xl" mb={8}>
          Pacientes cadastrados
        </Heading>
        <Box height="60vh" overflowY="auto">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>CPF</Th>
                  <Th>Paciente</Th>
                  <Th>Endereço</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {getCurrentPatients().map((patient) => (
                  <Tr key={patient.id}>
                    <Td w="10%">{patient.cpf}</Td>
                    <Td>{patient.nome}</Td>
                    <Td>{patient.rua}</Td>
                    <Td>
                      <Flex justify={"end"}>
                        <Tooltip label="Editar" fontSize="md" placement="top">
                          <Button
                            mr={2}
                            onClick={() => handleEditPatient(patient)}
                          >
                            <MdOutlineEdit />
                          </Button>
                        </Tooltip>
                        <Tooltip label="Excluir" fontSize="md" placement="top">
                          <Button
                            mr={2}
                            onClick={() => handleDeletePatient(patient.id)}
                          >
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

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(patients.length / patientsPerPage)}
          onPageChange={handlePageChange}
        />
      </Flex>

      <BaseModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        modalHeaderText="Editar Dados do Paciente"
        modalFooter={
          <Button
            type="submit"
            mt={3}
            bg="#00834F"
            color="#FFF"
            _hover={{
              color: "#00834F",
              bg: "transparent",
              border: "1px solid #00834F"
            }}
            onClick={handleSubmit}
          >
            Salvar
          </Button>
        }
      >
        <Box as="form">
          <FormControl>
            <FormLabel>CPF</FormLabel>
            <Input
              type="text"
              name="cpf"
              value={editedPatient?.cpf}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel mt={4}>Nome</FormLabel>
            <Input
              type="text"
              name="nome"
              value={editedPatient?.nome}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel mt={4}>CEP</FormLabel>
            <Input
              type="text"
              name="cep"
              value={editedPatient?.cep}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel mt={4}>Endereço</FormLabel>
            <Input
              type="text"
              name="rua"
              value={editedPatient?.rua}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel mt={4}>Número</FormLabel>
            <Input
              type="text"
              name="numero"
              value={editedPatient?.numero}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel mt={4}>Bairro</FormLabel>
            <Input
              type="text"
              name="bairro"
              value={editedPatient?.bairro}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel mt={4}>Complemento</FormLabel>
            <Input
              type="text"
              name="complemento"
              value={editedPatient?.complemento}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel mt={4}>Cidade</FormLabel>
            <Input
              type="text"
              name="cidade"
              value={editedPatient?.cidade}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel mt={4}>UF</FormLabel>
            <Input
              type="text"
              name="uf"
              value={editedPatient?.uf}
              onChange={handleInputChange}
            />
          </FormControl>
        </Box>
      </BaseModal>
    </>
  )
}

export default PatientRegistration
