import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button, Flex, Tooltip, Input, FormControl, FormLabel, Heading, Select } from '@chakra-ui/react'
import { Header, BaseModal, Pagination } from '../../components'
import { MdOutlineEdit, MdDeleteOutline } from 'react-icons/md'
import { api } from '../../services/api'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import FormattedDate from '../../common/FormattedDate'

interface FormData {
  id: number
  formula: string
  quantidade: number
  tarja: string
  vencimento: string
}

enum Tarja {
  SEM_TARJA = 'SEM_TARJA',
  AMARELA = 'AMARELA',
  VERMELHA = 'VERMELHA',
  PRETA = 'PRETA',
}

const MedicamentRegistration = () => {
  const [medicaments, setMedicaments] = useState<FormData[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [_selectedMedicament, setSelectedMedicament] = useState<FormData | null>(null)
  const [editedMedicament, setEditedMedicament] = useState<FormData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [medicamentsPerPage] = useState(5)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/medicamentos')
        setMedicaments(response.data)
      } catch (error) {
        console.error('Erro ao buscar medicamentos:', error)
      }
    }

    fetchData()
  }, [])

  const tarjaLabel: Record<Tarja, string> = {
    SEM_TARJA: 'Sem tarja',
    AMARELA: 'Amarela',
    VERMELHA: 'Vermelha',
    PRETA: 'Preta',
  }

  const tarjaBgColor: Record<Tarja, string> = {
    SEM_TARJA: '#FFF',
    AMARELA: 'yellow.100',
    VERMELHA: 'red.100',
    PRETA: 'gray.100',
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const getCurrentMedicaments = () => {
    const indexOfLastMedicament = currentPage * medicamentsPerPage
    const indexOfFirstMedicament = indexOfLastMedicament - medicamentsPerPage
    return medicaments.slice(indexOfFirstMedicament, indexOfLastMedicament)
  }

  const handleEditMedicament = (medicament: FormData) => {
    setSelectedMedicament(medicament)
    setEditedMedicament({ ...medicament })
    setIsEditModalOpen(true)
  }

  const handleModalClose = () => {
    setIsEditModalOpen(false)
    setSelectedMedicament(null)
    setEditedMedicament(null)
  }

  const handleDeleteMedicament = async (id: number) => {
    try {
      await api.delete(`/medicamentos/${id}`)
      setMedicaments(medicaments.filter(medicament => medicament.id !== id))
    } catch (error) {
      console.error('Erro ao excluir paciente:', error)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (editedMedicament) {
      const updatedMedicament = {
        ...editedMedicament,
        [name]: value,
      }
      setEditedMedicament(updatedMedicament)
    }
  }

  const handleSubmit = async () => {
    if (editedMedicament) {
      try {
        await api.put(`/medicamentos/${editedMedicament.id}`, editedMedicament)
        setMedicaments(medicaments.map(medicament => (medicament.id === editedMedicament.id ? editedMedicament : medicament)))
        setIsEditModalOpen(false)
        setSelectedMedicament(null)
        setEditedMedicament(null)
        toast.success('Dados atualizados com sucesso!')
      } catch (err) {
        toast.error('Erro ao atualizar paciente!')
      }
    }
  }

  return (
    <>
      <Header />
      <Flex direction='column' height='calc(100vh - 75px)' p={8} >
        <Heading as="h1" fontWeight="bold" fontSize='xl' mb={8}>Medicamentos cadastrados</Heading>
        <Box height="60vh" overflowY="auto" >
          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Medicamento</Th>
                  <Th>Tarja</Th>
                  <Th>Quantidade</Th>
                  <Th>Data de Validade</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {getCurrentMedicaments().map(medicament => (
                  <Tr key={medicament.id} >
                    <Td w='30%'>{medicament.formula}</Td>
                    <Td w="25%" bg={tarjaBgColor[medicament.tarja as Tarja]}>{tarjaLabel[medicament.tarja as Tarja]}</Td>
                    <Td w='20%'>{medicament.quantidade}</Td>
                    <Td w='20%'><FormattedDate date={new Date(medicament.vencimento)} /></Td>
                    <Td>
                      <Flex justify={'end'}>
                        <Tooltip label='Editar' fontSize='md' placement='top'>
                          <Button mr={2} onClick={() => handleEditMedicament(medicament)}>
                            <MdOutlineEdit />
                          </Button>
                        </Tooltip>
                        <Tooltip label='Excluir' fontSize='md' placement='top'>
                          <Button mr={2} onClick={() => handleDeleteMedicament(medicament.id)}>
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
          totalPages={Math.ceil(medicaments.length / medicamentsPerPage)}
          onPageChange={handlePageChange}
        />
      </Flex>

      <BaseModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        modalHeaderText="Editar Dados do Medicamento"
        modalFooter={<Button
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
        >Salvar</Button>}
      >
        <Box as="form" >
          <FormControl>
            <FormLabel>Medicamento</FormLabel>
            <Input type="text" name="formula" value={editedMedicament?.formula} onChange={handleInputChange} />
          </FormControl>
          <FormControl>
            <FormLabel mt={4}>Tarja</FormLabel>
            <Select 
              id="tarja" 
              name="tarja"
              value={editedMedicament?.tarja}
              onChange={handleInputChange}
            >
              <option value="">Selecione a tarja...</option>
              <option value="SEM_TARJA">Sem tarja</option>
              <option value="AMARELA">Amarela</option>
              <option value="VERMELHA">Vermelha</option>
              <option value="PRETA">Preta</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel mt={4}>Quantidade</FormLabel>
            <Input type="text" name="quantidade" value={editedMedicament?.quantidade} onChange={handleInputChange} />
          </FormControl>
          <FormControl>
            <FormLabel mt={4}>Data de Vencimento</FormLabel>
            <Input type="text" name="vencimento" value={editedMedicament?.vencimento} onChange={handleInputChange} />
          </FormControl>
        </Box>
      </BaseModal>
    </>
  )
}

export default MedicamentRegistration