# Endpoints expuestos por módulo
curl -s -X POST http://localhost:8080/api/auth/login -H 'Content-Type: application/json' -d '{"email":"test@kumo.com","password":"demo12345"}'

TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login -H 'Content-Type: application/json' -d '{"email":"test@kumo.com","password":"demo12345"}' | jq -r '.token'); echo $TOKEN | wc -c

curl -s http://localhost:8080/actuator/mappings -H "Authorization: Bearer $TOKEN" | jq -r '.contexts | .[] | .mappings.dispatcherServlets.dispatcherServlet[] | select(.details.requestMappingConditions != null) | .details.requestMappingConditions | .methods[] as $m | .patterns[] as $p | select($p | startswith("/actu") | not) | select($p | startswith("/error") | not) | "[\($m)] \($p)"' | sort

## Modulo seguridad
- [POST] /api/auth/login
- [POST] /api/auth/register
- [GET] /api/perfil/me
- [PUT] /api/perfil/me

## Modulo hábitos
- [GET] /api/habitos
- [GET] /api/habitos/{id}
- [POST] /api/habitos
- [PUT] /api/habitos/{id}
- [DELETE] /api/habitos/{id}
- [GET] /api/metas
- [GET] /api/metas/habito/{habitoId}
- [GET] /api/metas/{metaId}
- [POST] /api/metas
- [PUT] /api/metas/{metaId}
- [DELETE] /api/metas/{metaId}

## Modulo seguimiento
- [GET] /api/registros/habito/{habitoId}
- [POST] /api/registros
- [DELETE] /api/registros/{registroId}

## Modulo métricas
- [GET] /api/metricas/habito/{habitoId}

## Modulo recordatorios
- [GET] /api/recordatorios/habito/{habitoId}
- [POST] /api/recordatorios
- [PUT] /api/recordatorios/{recordatorioId}
- [DELETE] /api/recordatorios/{recordatorioId}
