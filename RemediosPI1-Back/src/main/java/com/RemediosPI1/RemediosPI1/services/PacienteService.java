package com.RemediosPI1.RemediosPI1.services;

import com.RemediosPI1.RemediosPI1.models.PacienteModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public interface PacienteService {

    List<PacienteModel> getAllPacientes();

    Optional<PacienteModel> getPacienteById(Long id);

    PacienteModel savePaciente(PacienteModel paciente, String cep);

    void deletePaciente(Long id);
}
