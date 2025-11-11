package com.kumo.www.feature.seguridad.entity.converter;

import com.kumo.www.feature.seguridad.entity.enums.FormatoFecha;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class FormatoFechaConverter implements AttributeConverter<FormatoFecha, String> {
    @Override
    public String convertToDatabaseColumn(FormatoFecha attribute) {
        return attribute == null ? null : attribute.getDbValue();
    }

    @Override
    public FormatoFecha convertToEntityAttribute(String dbData) {
        return FormatoFecha.fromDbValue(dbData);
    }
}
