package com.RemediosPI1.RemediosPI1.services.impl;

import com.RemediosPI1.RemediosPI1.enums.TarjaMedicamento;
import com.RemediosPI1.RemediosPI1.models.MedicamentoModel;
import com.RemediosPI1.RemediosPI1.repositories.MedicamentoRepository;
import com.RemediosPI1.RemediosPI1.services.MedicamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicamentoServiceImpl implements MedicamentoService {
    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Override
    public List<MedicamentoModel> getAllMedicamentos() {
        return medicamentoRepository.findAll();
    }

    @Override
    public Optional<MedicamentoModel> getMedicamentoById(Long id) {
        return medicamentoRepository.findById(id);
    }

    @Override
    public MedicamentoModel saveMedicamento(MedicamentoModel medicamento) {
        if (medicamento.getTarja() == null) {
            throw new IllegalArgumentException("A tarja do medicamento é obrigatória.");
        }
        return medicamentoRepository.save(medicamento);
    }

    @Override
    public void deleteMedicamento(Long id) {
        medicamentoRepository.deleteById(id);
    }

    @Override
    public List<MedicamentoModel> getMedicamentosByTarja(TarjaMedicamento tarja) {
        return medicamentoRepository.findByTarja(tarja);
    }
}
