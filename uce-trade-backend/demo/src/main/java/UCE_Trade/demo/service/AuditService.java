package UCE_Trade.demo.service;

import UCE_Trade.demo.model.AuditLog;
import UCE_Trade.demo.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuditService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String action, String entity, Long entityId, String detail, String username) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntity(entity);
        log.setEntityId(entityId);
        log.setDetail(detail);
        log.setUsername(username);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }
}