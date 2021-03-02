module BlacklightHeatmaps
  ##
  # Provides methods to convert Solr geometry strings
  module GeometrySolrDocument
    def to_geojson(blacklight_config = nil)
      return unless blacklight_config&.geometry_field&.present? && fetch(blacklight_config.geometry_field, nil)
      {
        type: 'FeatureCollection',
        features: Array(fetch(blacklight_config.geometry_field)).map do |geometry|
          {
            type: 'Feature',
            geometry: JSON.parse(
              BlacklightHeatmaps::GeometryParser.parse(geometry).to_geojson
            ),
            properties: {}
          }
        end
      }.to_json
    end
  end
end
