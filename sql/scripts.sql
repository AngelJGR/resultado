
-- Listar los consultores

SELECT a.co_usuario, a.no_usuario FROM cao_usuario AS a
INNER JOIN permissao_sistema AS b ON a.co_usuario = b.co_usuario
WHERE b.co_sistema = 1 AND b.in_ativo = 'S' AND b.co_tipo_usuario IN(0,1,2);



SELECT b.co_usuario, a.co_fatura, a.co_cliente, a.co_sistema, a.co_os, a.total, a.data_emissao, a.total_imp_inc
FROM cao_fatura AS a
INNER JOIN cao_os AS b ON a.co_os = b.co_os
WHERE a.data_emissao between"2007-02-01" AND "2007-06-30"
AND b.co_usuario = (SELECT co_usuario FROM cao_usuario WHERE co_usuario = "anapaula.chiodaro");

