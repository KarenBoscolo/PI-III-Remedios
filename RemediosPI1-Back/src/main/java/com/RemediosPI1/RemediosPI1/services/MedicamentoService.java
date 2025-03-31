package com.RemediosPI1.RemediosPI1.services;

import com.RemediosPI1.RemediosPI1.enums.TarjaMedicamento;
import com.RemediosPI1.RemediosPI1.models.MedicamentoModel;
import com.RemediosPI1.RemediosPI1.models.UsuarioModel;

import java.util.List;
import java.util.Optional;

public interface MedicamentoService {
    List<MedicamentoModel> getAllMedicamentos();
    Optional<MedicamentoModel> getMedicamentoById(Long id);
    MedicamentoModel saveMedicamento(MedicamentoModel medicamento);
    void deleteMedicamento(Long id);

    List<MedicamentoModel> getMedicamentosByTarja(TarjaMedicamento tarja);

    interface UsuarioService {
        Optional<UsuarioModel> autenticar(String nomeUsuario, String senha);
        UsuarioModel salvarUsuario(UsuarioModel usuario);
        Optional<UsuarioModel> buscarPorNomeUsuario(String nomeUsuario);
    }
}
