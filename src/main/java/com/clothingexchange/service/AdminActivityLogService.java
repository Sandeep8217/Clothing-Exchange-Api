
package com.clothingexchange.service;

import com.clothingexchange.model.AdminActivityLog;
import com.clothingexchange.repository.AdminActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminActivityLogService {

    private final AdminActivityLogRepository activityLogRepository;

    public void logActivity(
            String adminId,
            String adminEmail,
            String action,
            String targetType,
            String targetId,
            String description
    ) {
        AdminActivityLog log = new AdminActivityLog();

        log.setAdminId(adminId);
        log.setAdminEmail(adminEmail);
        log.setAction(action);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setDescription(description);
        log.setCreatedAt(LocalDateTime.now());

        activityLogRepository.save(log);
    }

    public List<AdminActivityLog> getAllActivities() {
        return activityLogRepository
                .findAllByOrderByCreatedAtDesc();
    }
}
