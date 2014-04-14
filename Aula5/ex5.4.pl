%% Ex 5.4
%% Implementar fatorial em Prolog.
fat(0, 1).

fat(F, NF) :-
	fat(F - 1, BF),
    NF is F * BF.
%% Exemplo de query:
%% ?- fat(10, X)