package com.kumo.www.feature.seguridad.entity.enums;

public enum FormatoFecha {
    // Java-friendly names mapped explicitly to PostgreSQL enum labels
    DD_MM_AAAA("DD/MM/AAAA"),
    MM_DD_AAAA("MM/DD/AAAA"),
    AAAA_MM_DD("AAAA-MM-DD");

    private final String dbValue;

    FormatoFecha(String dbValue) {
        this.dbValue = dbValue;
    }

    public String getDbValue() {
        return dbValue;
    }

    public static FormatoFecha fromDbValue(String value) {
        if (value == null)
            return null;
        for (FormatoFecha f : values()) {
            if (f.dbValue.equals(value)) {
                return f;
            }
        }
        throw new IllegalArgumentException("Valor de formato_fecha desconocido: " + value);
    }
}
