package app.service;

import java.util.Collection;
import java.util.Optional;

public interface CRUDService<T> {
    T save(T entity);
    Collection<T> getAll();
    Optional<T> findById(Long id);
    void delete(Long id);
}
