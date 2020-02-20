all:
	cd 001_pgd         && run_prep_pgd && run_plot_pgd
	cd 002_real        && run_prep_real
	cd 003_mesonh      && run_mesonh
	cd 004_diag        && run_diag
	cd 005_conv2dia    && run_conv2dia
	cd 006_diaprog     && run_diaprog 
	cd 007_dia2grb     && run_dia2grb
	cd 008_plotgrb     && run_plotgrb

clean:
	cd 001_pgd         && clean_prep_pgd
	cd 002_real        && clean_prep_real
	cd 003_mesonh      && clean_mesonh
	cd 004_diag        && clean_diag
	cd 005_conv2dia    && clean_conv2dia
	cd 006_diaprog     && clean_diaprog 
	cd 007_dia2grb     && clean_dia2grb
	cd 008_plotgrb     && clean_plotgrb

pgd:
	cd 001_pgd         && run_prep_pgd && run_plot_pgd

real:
	cd 002_real        && run_prep_real

mesonh:
	cd 003_mesonh      && run_mesonh

diag:
	cd 004_diag        && run_diag

conv2dia:
	cd 005_conv2dia    && run_conv2dia

diaprog:
	cd 006_diaprog    && run_diaprog

dia2grb:
	cd 007_dia2grb    && run_dia2grb

plotgrb:
	cd 008_plotgrb    && run_plotgrb

