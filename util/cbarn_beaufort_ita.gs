*
*  Script to plot a colorbar
*
*  The script will assume a colorbar is wanted even if there is 
*  not room -- it will plot on the side or the bottom if there is
*  room in either place, otherwise it will plot along the bottom and
*  overlay labels there if any.  This can be dealt with via 
*  the 'set parea' command.  In version 2 the default parea will
*  be changed, but we want to guarantee upward compatibility in
*  sub-releases.
*
*
*       modifications by mike fiorino 940614
*
*       - the extreme colors are plotted as triangles
*       - the colors are boxed in white
*       - input arguments in during a run execution:
* 
*       run cbarn sf vert xmid ymid
*
*       sf   - scale the whole bar 1.0 = original 0.5 half the size, etc.
*       vert - 0 FORCES a horizontal bar = 1 a vertical bar
*       xmid - the x position on the virtual page the center the bar
*       ymid - the x position on the virtual page the center the bar
*
*       if vert,xmid,ymid are not specified, they are selected
*       as in the original algorithm
*  

function colorbar (args)

sf=subwrd(args,1)
vert=subwrd(args,2)
xmid=subwrd(args,3)
ymid=subwrd(args,4)

if(sf='');sf=1.0;endif

*
*  Check shading information
*
  'query shades'
  shdinfo = result
  if (subwrd(shdinfo,1)='None')
    say 'Cannot plot color bar: No shading information'
    return
  endif
* 
*  Get plot size info
*
  'query gxinfo'
  rec2 = sublin(result,2)
  rec3 = sublin(result,3)
  rec4 = sublin(result,4)
  xsiz = subwrd(rec2,4)
  ysiz = subwrd(rec2,6)
  ylo = subwrd(rec4,4)
  xhi = subwrd(rec3,6)
  xd = xsiz - xhi

  ylolim=0.6*sf
  xdlim1=1.0*sf
  xdlim2=1.5*sf  
  barsf=0.8*sf
  yoffset=0.2*sf
  stroff=0.05*sf
  strxsiz=0.12*sf
  strysiz=0.13*sf
*
*  Decide if horizontal or vertical color bar
*  and set up constants.
*
  if (ylo<ylolim & xd<xdlim1)
    say "Not enough room in plot for a colorbar"
    return
  endif
  cnum = subwrd(shdinfo,5)
*
*       logic for setting the bar orientation with user overides
*
  if (ylo<ylolim | xd>xdlim1)
    vchk = 1
    if(vert = 0) ; vchk = 0 ; endif
  else
    vchk = 0
    if(vert = 1) ; vchk = 1 ; endif
  endif
*
*       vertical bar
*
  if (vchk = 1 )

    if(xmid = '') ; xmid = xhi+xd/2 ; endif
    xwid = 0.2*sf
    ywid = 0.5*sf

    xl = xmid-xwid/2
    xr = xl + xwid
    if (ywid*cnum > ysiz*barsf) 
      ywid = ysiz*barsf/cnum
    endif
    if(ymid = '') ; ymid = ysiz/2 ; endif
    yb = ymid - ywid*cnum/2
    'set string 1 l 5'
    vert = 1

  else

*
*       horizontal bar
*

    ywid = 0.4
    xwid = 0.7

    if(ymid = '') ; ymid = ylo/2-ywid/2 ; endif
    yt = ymid + yoffset
    yb = ymid
    if(xmid = '') ; xmid = xsiz/2 ; endif
    if (xwid*cnum > xsiz*barsf)
      xwid = xsiz*barsf/cnum
    endif
    xl = xmid - xwid*cnum/2
    'set string 1 tc 5'
    vert = 0
  endif

*  Plot colorbar

  'set strsiz 'strxsiz' 'strysiz
  num = 0
  while (num<cnum)
    rec = sublin(shdinfo,num+2)
    col = subwrd(rec,1)
    hi = subwrd(rec,3)
    if (vert = 1)
      yt = yb + ywid
    'set strsiz 0.10'
    'draw string 'xmid-0.32' 'ymid-3.5' BEAUFORT'
    'draw string 'xmid-0.22' 'ymid-3.65' SCALE'
    'set strsiz 'strxsiz' 'strysiz
    else
      xr = xl + xwid
    'set strsiz 0.10'
    'set string 1'
*    'draw string 'xmid-5.1' 'ymid+0.33' Scala Beaufort'
*    'draw string 'xmid-5.3' 'ymid-0.06' Vento'
*    'draw string 'xmid-5.0' 'ymid-0.06' a'
*    'draw string 'xmid-4.75' 'ymid-0.06' 10m'
*    'set strsiz 0.11'
*    'set string 1'
*    'draw string 'xmid-4.22' 'ymid-0.05' km/h'
*    'set rgb 94 0 0 255'
*    'set string 94'
*    'set strsiz 0.09'
*    'draw string 'xmid-4.31' 'ymid-0.19' nodi'
*    'set rgb 95 255 0 0'
*    'set string 95'
*    'set strsiz 0.09'
*    'draw string 'xmid-4.3' 'ymid-0.3' m/s'
    'set string 1'
    'set strsiz 'strxsiz' 'strysiz
    endif

*   Draw the left/bottom triangle
    if (num = 0)
      if(vert = 1)
        xm = (xl+xr)*0.5
        'set line 'col
        'draw polyf 'xl' 'yt' 'xm' 'yb' 'xr' 'yt' 'xl' 'yt
        'set line 1 1 5'
        'draw line 'xl' 'yt' 'xm' 'yb
        'draw line 'xm' 'yb' 'xr' 'yt
        'draw line 'xr' 'yt' 'xl' 'yt
      else
        ym = (yb+yt)*0.5
        'set line 'col
        'draw polyf 'xl' 'ym' 'xr' 'yb' 'xr' 'yt' 'xl' 'ym
        'set line 1 1 5'
        'draw line 'xl' 'ym' 'xr' 'yb
        'draw line 'xr' 'yb' 'xr' 'yt
        'draw line 'xr' 'yt' 'xl' 'ym
      endif
    endif

*   Draw the middle boxes
 if (num!=0 & num!= cnum-1)
      'set line 'col
      'draw recf 'xl' 'yb' 'xr' 'yt-0.01
      'set line 1 1 5'
      'draw rec  'xl' 'yb' 'xr' 'yt
    endif
    if (num=0)
      if (vert = 1)
      'draw line 'xl-0.13' 'yt' 'xl' 'yt''
*     'set rgb 99 80 80 80'
*      'set string 94'
*      'set strsiz 0.09'
*      'draw string 'xl-0.22' 'yt-0.2' 1'
*      'set string 95'
*      'set strsiz 0.09'
*      'draw string 'xl-0.22' 'yt-0.2' 0.5'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.2' F0'
      'set strsiz 'strxsiz' 'strysiz
      else
      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.4' 1'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.5' 0.5'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xr-0.17' 'yt-0.06' F0'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xr-0.27' 'yt+0.13' calma'
      'set string 1'
      'draw string 'xmid-5.1' 'ymid+0.33' Scala Beaufort'
      'set strsiz 0.11'
      'set string 1'
      'draw string 'xmid-4.22' 'ymid-0.05' km/h'
      'set rgb 94 0 0 255'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xmid-4.31' 'ymid-0.19' nodi'
      'set rgb 95 255 0 0'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xmid-4.3' 'ymid-0.3' m/s'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif
    if (num=1)
      if (vert = 1)
      'draw line 'xl-0.13' 'yt' 'xl' 'yt''
      'set rgb 99 80 80 80'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.42' F2'
      'set strsiz 'strxsiz' 'strysiz
      'set string 1'
      else
*      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.4' 3'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.5' 1.5'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xr-0.3' 'yt-0.06' F1'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xr-0.32' 'yt+0.13' bava'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif
    if (num=2)
      if (vert = 1)
      'draw line 'xl-0.13' 'yt' 'xl' 'yt''
      'set rgb 99 80 80 80'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.42' F3'
      'set strsiz 'strxsiz' 'strysiz
      'set string 1'
      else
*      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.4' 6'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.5' 3'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xr-0.3' 'yt-0.06' F2'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xr-0.34' 'yt+0.13' brezza'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif
    if (num=3)
      if (vert = 1)
      'draw line 'xl-0.13' 'yt' 'xl' 'yt''
      'set rgb 99 80 80 80'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.62' F4'
      'set strsiz 'strxsiz' 'strysiz
      'set string 1'
      else
      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.4' 10'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.5' 5'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xr-0.3' 'yt-0.06' F3'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xr-0.34' 'yt+0.13' br.tesa'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif
    if (num=4)
      if (vert = 1)
      'draw line 'xl-0.13' 'yt' 'xl' 'yt''
      'set rgb 99 80 80 80'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.42' F5'
      'set strsiz 'strxsiz' 'strysiz
      'set string 1'
      else
*      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.4' 16'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.5' 8'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xr-0.3' 'yt-0.06' F4'
      'set string 99'
      'set strsiz 0.09'
      'draw string 'xr-0.34' 'yt+0.13' moderato'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif
    if (num=5)
      if (vert = 1)
      'draw line 'xl-0.13' 'yt' 'xl' 'yt''
      'set rgb 99 80 80 80'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.42' F6'
      'set strsiz 'strxsiz' 'strysiz
      'set string 1'
      else
      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.4' 21'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.5' 11'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xr-0.3' 'yt-0.06' F5'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xr-0.34' 'yt+0.13' teso'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif
    if (num=6)
      if (vert = 1)
      'draw line 'xl-0.13' 'yt' 'xl' 'yt''
      'set rgb 99 80 80 80'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.62' F7'
      'set strsiz 'strxsiz' 'strysiz
      'set string 1'
      else
*      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.4' 27'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.5' 14'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xr-0.3' 'yt-0.06' F6'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xr-0.34' 'yt+0.13' fresco'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif
    if (num=7)
      if (vert = 1)
      'set rgb 99 80 80 80'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.2' F8'
      'set strsiz 'strxsiz' 'strysiz
      'set string 1'
      else
      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.4' 33'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.5' 17'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xr-0.3' 'yt-0.06' F7'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xr-0.34' 'yt+0.13' forte'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif
    if (num=8)
      if (vert = 1)
      'set rgb 99 80 80 80'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.2' F8'
      'set strsiz 'strxsiz' 'strysiz
      'set string 1'
      else
*      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.4' 40'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.5' 20'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xr-0.3' 'yt-0.06' F8'
      'set string 99'
      'set strsiz 0.09'
      'draw string 'xr-0.34' 'yt+0.13' burrasca'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif
    if (num=9)
      if (vert = 1)
      'set rgb 99 80 80 80'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.2' F8'
      'set strsiz 'strxsiz' 'strysiz
      'set string 1'
      else
      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.4' 47'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.5' 24'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xr-0.3' 'yt-0.06' F9'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xr-0.34' 'yt+0.13' b.forte'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif
    if (num=10)
      if (vert = 1)
      'set rgb 99 80 80 80'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.2' F8'
      'set strsiz 'strxsiz' 'strysiz
      'set string 1'
      else
*      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.4' 55'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.5' 28'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xr-0.3' 'yt-0.06' F10'
      'set string 99'
      'set strsiz 0.09'
      'draw string 'xr-0.34' 'yt+0.13' tempesta'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif
    if (num=11)
      if (vert = 1)
      'set rgb 99 80 80 80'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.2' F8'
      'set strsiz 'strxsiz' 'strysiz
      'set string 1'
      else
      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.4' 63'
      'set string 95'
      'set strsiz 0.09'
      'draw string 'xr-0.0' 'yt-0.5' 32,5'
      'set string 1'
      'set strsiz 0.10'
      'draw string 'xr-0.3' 'yt-0.06' F11'
      'set string 99'
      'set strsiz 0.09'
      'draw string 'xr-0.34' 'yt+0.13' fortunale'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif
    if (num=12)
      if (vert = 1)
      'set rgb 99 80 80 80'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xl-0.22' 'yt-0.2' F8'
      'set strsiz 'strxsiz' 'strysiz
      'set string 1'
      else
*      'draw line 'xr' 'yt' 'xr' 'yt+0.13''
      'set rgb 99 80 80 80'
      'set string 94'
      'set strsiz 0.09'
*      'draw string 'xr-0.0' 'yt-0.4' 33'
      'set string 95'
      'set strsiz 0.09'
*      'draw string 'xr-0.0' 'yt-0.5' 17'
      'set string 99'
      'set strsiz 0.10'
      'draw string 'xr-0.34' 'yt+0.13' uragano'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif


*   Draw the right/top triangle
    if (num = cnum-1)
      if (vert = 1)
        'set line 'col
        'draw polyf 'xl' 'yb' 'xm' 'yt' 'xr' 'yb' 'xl' 'yb
        'set line 1 1 5'
        'draw line 'xl' 'yb' 'xm' 'yt
        'draw line 'xm' 'yt' 'xr' 'yb
        'draw line 'xr' 'yb' 'xl' 'yb
      else
        'set line 'col
        'draw polyf 'xr' 'ym' 'xl' 'yb' 'xl' 'yt' 'xr' 'ym
        'set line 1 1 5'
        'draw line 'xr' 'ym' 'xl' 'yb
        'draw line 'xl' 'yb' 'xl' 'yt
        'draw line 'xl' 'yt' 'xr' 'ym
      'set strsiz 0.10'
      'draw string 'xr-0.51' 'yt-0.06' F12'
      'set string 1'
      'set strsiz 'strxsiz' 'strysiz
      endif
    endif

*   Put numbers under each segment of the color key
    if (num < cnum-1)
      if (vert)
        xp=xr+stroff
        'draw string 'xp' 'yt' 'hi
      else
        yp=yb-stroff
       'draw string 'xr' 'yp' 'hi
      endif
    endif

*   Reset variables for next loop execution
    if (vert)
      yb = yt
    else
      xl = xr
    endif
    num = num + 1

  endwhile

return
