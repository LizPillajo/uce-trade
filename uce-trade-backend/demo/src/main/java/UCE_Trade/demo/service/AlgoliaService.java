package UCE_Trade.demo.service;

import UCE_Trade.demo.model.Venture;
import com.algolia.search.DefaultSearchClient;
import com.algolia.search.SearchClient;
import com.algolia.search.SearchIndex;
import com.algolia.search.models.indexing.Query;
import com.algolia.search.models.indexing.SearchResult;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AlgoliaService {

    @Value("${algolia.app-id}")
    private String appId;

    @Value("${algolia.api-key}")
    private String apiKey;

    @Value("${algolia.index-name}")
    private String indexName;

    private SearchIndex<VentureIndex> index;

    @PostConstruct
    public void init() {
        SearchClient client = DefaultSearchClient.create(appId, apiKey);
        this.index = client.initIndex(indexName, VentureIndex.class);
    }

    // Guardar o Actualizar en Algolia
    public void saveVenture(Venture venture) {
        try {
            // Solo indexamos si NO está borrado y está activo
            if (!venture.isDeleted() && "Active".equalsIgnoreCase(venture.getStatus())) {
                VentureIndex entry = new VentureIndex(
                        venture.getId().toString(),
                        venture.getTitle(),
                        venture.getDescription(),
                        venture.getCategory(),
                        venture.getPrice().doubleValue(),
                        venture.getOwner().getFullName()
                );
                index.saveObject(entry).waitTask();
            } else {
                // Si se borró o desactivó, lo sacamos del índice
                deleteVenture(venture.getId());
            }
        } catch (Exception e) {
            System.err.println("Error syncing to Algolia: " + e.getMessage());
        }
    }

    // Borrar de Algolia
    public void deleteVenture(Long id) {
        try {
            index.deleteObject(id.toString());
        } catch (Exception e) {
            System.err.println("Error deleting from Algolia: " + e.getMessage());
        }
    }

    // Búsqueda en Algolia
    public List<Long> search(String queryText, String category) {
        try {
            Query query = new Query(queryText);
            
            // Filtro por categoría si existe
            if (category != null && !category.equals("All") && !category.isEmpty()) {
                query.setFilters("category:\"" + category + "\"");
            }

            SearchResult<VentureIndex> result = index.search(query);
            
            // Retornamos solo los IDs para buscar los objetos completos en DB
            return result.getHits().stream()
                    .map(h -> Long.parseLong(h.getObjectID()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    // Clase interna para mapear solo lo necesario a Algolia
    static class VentureIndex {
        private String objectID;
        private String title;
        private String description;
        private String category;
        private double price;
        private String ownerName;

        public VentureIndex() {}

        public VentureIndex(String objectID, String title, String description, String category, double price, String ownerName) {
            this.objectID = objectID;
            this.title = title;
            this.description = description;
            this.category = category;
            this.price = price;
            this.ownerName = ownerName;
        }

        // Getters y Setters necesarios para Jackson/Algolia
        public String getObjectID() { return objectID; }
        public void setObjectID(String objectID) { this.objectID = objectID; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
        public String getOwnerName() { return ownerName; }
        public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    }
}