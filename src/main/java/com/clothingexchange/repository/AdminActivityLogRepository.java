
package com.clothingexchange.repository;

import com.clothingexchange.model.AdminActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AdminActivityLogRepository
        extends MongoRepository<AdminActivityLog, String> {

    List<AdminActivityLog> findAllByOrderByCreatedAtDesc();
}
