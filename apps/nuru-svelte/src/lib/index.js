export const samplePrograms = {
	hello: {
		name: 'Salamu Dunia',
		description: 'Programu rahisi ya salamu',
		code: `// Karibu kwenye uwanja wa Nuru
// Programu ya kwanza - Salamu Dunia!

jina = jaza("Ingiza jina lako")

andika("Habari " + jina + "!")
andika("Karibu kwenye Nuru - lugha ya programu ya Kiswahili")`,
		output: 'Habari Mwanafunzi!\nKaribu kwenye Nuru - lugha ya programu ya Kiswahili'
	},
	calculator: {
		name: 'Kikokotoo',
		description: 'Kikokotoo rahisi',
		code: `// Karibu kwenye uwanja wa Nuru
// Kikokotoo rahisi

namba1 = namba(jaza("Ingiza namba ya kwanza"))
namba2 = namba(jaza("Ingiza namba ya pili"))

andika("Jumla: " , (namba1 + namba2))
andika("Tofauti: " , (namba1 - namba2))
andika("Bidhaa: " , (namba1 * namba2))
andika("Mgawanyo: " , (namba1 / namba2))`,
		output: 'Jumla: 15\nTofauti: 5\nBidhaa: 50\nMgawanyo: 2'
	},
	loop: {
		name: 'Kitanzi',
		description: 'Mfano wa kitanzi',
		code: `// Karibu kwenye uwanja wa Nuru
// Mfano wa kitanzi (loop)

idadi = namba(jaza("Hadi namba gani?"))

fanya i = 1

wakati(i <= idadi) {
  andika("Namba: " , i)
  i++
}

andika("Tumemaliza!")`,
		output: 'Namba: 1\nNamba: 2\nNamba: 3\nNamba: 4\nNamba: 5\nTumemaliza!'
	},
	factorial: {
		name: 'Factorial',
		description: 'Hesabu factorial',
		code: `// Karibu kwenye uwanja wa Nuru
// Programu ya kuhesabu factorial

fanya factorial = unda(n) {
  kama (n <= 1) {
    rudisha 1;
  } sivyo {
    rudisha n * factorial(n - 1);
  }
}

namba = namba(jaza("Ingiza namba"))
matokeo = factorial(namba)

andika("Factorial ya " , namba , " ni " , matokeo)`,
		output: 'Factorial ya 5 ni 120'
	},
		fibonacci: {
		name: 'Fibonacci',
		description: 'Mfano wa programu ya Fibonacci',
		code: `// Karibu kwenye uwanja wa Nuru
// Andika hapa chini na bonyeza kitufe cha 'kucheza' ili kuendesha

// Mfano wa programu ya Fibonacci

urefu = namba(jaza("ingiza urefu wa mlolongo"))

fanya fibo = unda(x) {
	kama (x == 0) {
		rudisha 0;
	} au kama (x == 1) {
		rudisha 1;
	} sivyo {
		rudisha fibo(x - 1) + fibo(x - 2);
	}
}
andika(fibo(urefu));`,
		output: '144'
	},
};

export const defaultCode = samplePrograms.hello.code