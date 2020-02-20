      PROGRAM MAPV
C
CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
C
C     Compute the coefficients from the stretching function of the
C     MesoNH vertical grid. See book 3 of MesoNH documentation 
C     (routine READ_VER_GRID.f90 from prep_real_case / prep_ideal_case 
C     for ZGRID_TYPE='FUNCTN')               
C  
C      12/03/96
CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
C
C   Declarations des variables
      INTEGER KMAX
      REAL ZGRD,ZTOP
      REAL RZ(1500) 
      REAL ZMAX, SGRD, STOP
      WRITE(6,*) 'Enter nb of levels KMAX and the level ZMAX_STRGRD:'
      READ(5,*) KMAX,ZMAX
      WRITE(6,*) 'Enter mesh size at groud and at the top:ZGRD, ZTOP'
      READ(5,*) ZGRD,ZTOP
      WRITE(6,*) ' Enter low- and high-level stretching: SGRD, STOP:'
      READ(5,*) SGRD,STOP

      RZ(2)=0.
      RZ(3)=ZGRD
      DO 10 i=3,KMAX
        IF (RZ(i).LE.ZMAX) THEN
          RZ(i+1)=RZ(i)+(RZ(i)-RZ(i-1))*(1+SGRD/100)
        ELSE
          RZ(i+1)=RZ(i)+(RZ(i)-RZ(i-1))*(1+STOP/100)
        ENDIF
        IF ((RZ(i+1)-RZ(i)).GT.ZTOP) THEN
          RZ(i+1)=RZ(i)+ZTOP
        ENDIF
        WRITE(6,*) 'altitude ',i,' : ',RZ(i),' - ',RZ(i)-RZ(i-1)
  10  CONTINUE 

      END
