
-- Listar los consultores

SELECT * FROM permissao_sistema AS a
INNER JOIN cao_usuario AS b ON a.co_usuario = b.co_usuario
WHERE a.co_sistema = 1 AND a.in_ativo = 'S' AND a.co_tipo_usuario IN(0,1,2);


