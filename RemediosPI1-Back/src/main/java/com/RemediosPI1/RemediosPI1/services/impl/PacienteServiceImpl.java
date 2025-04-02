package com.RemediosPI1.RemediosPI1.services.impl;

import com.RemediosPI1.RemediosPI1.clients.ViaCepClient;
import com.RemediosPI1.RemediosPI1.dto.ViaCepDTO;
import com.RemediosPI1.RemediosPI1.models.PacienteModel;
import com.RemediosPI1.RemediosPI1.repositories.PacienteRepository;
import com.RemediosPI1.RemediosPI1.services.PacienteService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteServiceImpl implements PacienteService {
    private final PacienteRepository pacienteRepository;
    private final ViaCepClient viaCepClient;

    public PacienteServiceImpl(PacienteRepository pacienteRepository, ViaCepClient viaCepClient) {
        this.pacienteRepository = pacienteRepository;
        this.viaCepClient = viaCepClient;
    }

    @Override
    public List<PacienteModel> getAllPacientes() {
        return pacienteRepository.findAll();
    }

    @Override
    public Optional<PacienteModel> getPacienteById(Long id) {
        return pacienteRepository.findById(id);
    }

    @Override
    public PacienteModel savePaciente(PacienteModel paciente, String cep) {
        ViaCepDTO viaCepDTO = viaCepClient.buscarCep(cep);

        if (viaCepDTO != null) {
            paciente.setCep(cep);
            paciente.setRua(viaCepDTO.getLogradouro());
            paciente.setCidade(viaCepDTO.getLocalidade());
            paciente.setEstado(viaCepDTO.getUf());
        }

        return pacienteRepository.save(paciente);
    }

    @Override
    public void deletePaciente(Long id) {
        pacienteRepository.deleteById(id);
    }
}
