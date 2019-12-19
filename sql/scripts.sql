
-- Listar los consultores

SELECT a.co_usuario, a.no_usuario FROM cao_usuario AS a
INNER JOIN permissao_sistema AS b ON a.co_usuario = b.co_usuario
WHERE b.co_sistema = 1 AND b.in_ativo = 'S' AND b.co_tipo_usuario IN(0,1,2);


/*MODELO DE PRUEBA*/
SELECT b.co_usuario, c.no_usuario, a.co_fatura, a.co_cliente, a.co_sistema, a.co_os, a.total, a.valor, a.data_emissao, a.total_imp_inc
FROM cao_fatura AS a
INNER JOIN cao_os AS b ON a.co_os = b.co_os
INNER JOIN cao_usuario AS c ON b.co_usuario = c.co_usuario
WHERE SUBSTR(a.data_emissao, 1, 7) between"2007-02" AND "2007-06"
AND b.co_usuario IN ("anapaula.chiodaro");

/*PARA EL BOTON RECEITA*/
SELECT b.co_usuario, c.no_usuario, YEAR( a.data_emissao ) AS anio, MONTH( a.data_emissao ) as mes,
ROUND( SUM( a.valor - (( a.total_imp_inc / 100 ) * a.valor) ), 2 ) AS receita_liquida,
d.brut_salario AS custo_fixo,
ROUND(SUM( ( a.valor - ( ( a.total_imp_inc / 100 ) * a.valor) ) * ( a.comissao_cn / 100 ) ), 2 ) AS comissao
FROM cao_fatura AS a
INNER JOIN cao_os AS b ON a.co_os = b.co_os
INNER JOIN cao_usuario AS c ON b.co_usuario = c.co_usuario
INNER JOIN cao_salario AS d ON c.co_usuario = d.co_usuario
WHERE MONTH( a.data_emissao ) between"01" AND "12"
AND YEAR( a.data_emissao ) between"2007" AND "2007"
AND b.co_usuario IN ("anapaula.chiodaro")
GROUP BY c.co_usuario, mes, anio;

