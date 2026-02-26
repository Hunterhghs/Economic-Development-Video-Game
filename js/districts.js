/**
 * districts.js — Lagos district data and SVG map rendering
 */

const Districts = (() => {

    const DISTRICTS = [
        {
            id: 'lagos-island',
            name: 'Lagos Island',
            description: 'Financial hub & cultural heritage center',
            color: '#00c77b',
            gdpShare: 0.25,
            popShare: 0.08,
            devLevel: 72,
            specialization: 'Finance & Heritage',
            // SVG path for the district (stylized map)
            path: 'M 320.0 340.0 L 321.5 337.3 L 324.0 335.7 L 326.6 334.1 L 329.2 332.9 L 332.2 332.2 L 335.1 333.1 L 337.9 331.9 L 340.8 331.7 L 343.2 330.1 L 345.6 328.6 L 347.0 326.0 L 349.6 324.5 L 352.4 323.5 L 355.3 323.5 L 357.8 322.0 L 360.0 320.0 L 363.3 320.2 L 366.4 320.9 L 369.4 319.6 L 372.7 319.5 L 376.1 320.4 L 379.4 319.5 L 382.3 321.1 L 384.9 323.2 L 388.2 323.4 L 391.0 325.1 L 394.2 324.2 L 397.4 324.8 L 400.5 325.8 L 403.7 325.6 L 406.9 325.5 L 410.0 325.0 L 410.0 327.1 L 410.3 329.3 L 411.2 331.3 L 412.9 332.7 L 414.1 334.3 L 415.5 335.8 L 416.4 337.7 L 417.7 339.3 L 419.5 340.4 L 420.6 342.2 L 422.4 343.2 L 423.7 344.8 L 425.2 346.2 L 426.4 348.0 L 428.4 348.6 L 430.0 350.0 L 430.3 352.1 L 430.0 354.1 L 429.7 356.3 L 430.6 358.2 L 429.8 360.1 L 429.3 362.1 L 428.2 363.9 L 427.4 365.8 L 427.2 367.9 L 426.3 369.7 L 425.2 371.4 L 424.6 373.4 L 424.1 375.4 L 422.9 377.1 L 421.6 378.7 L 420.0 380.0 L 417.2 380.1 L 414.7 378.7 L 412.0 379.0 L 409.3 378.7 L 406.5 378.6 L 403.9 377.8 L 401.3 378.9 L 398.5 379.1 L 395.7 379.3 L 393.4 380.9 L 390.9 382.1 L 389.1 384.2 L 387.2 386.3 L 385.0 387.9 L 382.4 388.7 L 380.0 390.0 L 377.5 388.8 L 374.9 387.8 L 373.1 385.6 L 370.5 384.3 L 367.8 384.8 L 365.0 384.9 L 362.2 384.8 L 359.5 383.8 L 357.4 381.9 L 354.7 381.5 L 352.2 380.5 L 349.7 379.6 L 346.9 379.4 L 344.5 378.0 L 341.8 377.1 L 340.0 375.0 L 338.2 374.3 L 336.5 373.7 L 335.0 372.5 L 333.0 372.2 L 331.1 371.8 L 329.2 372.3 L 327.2 371.8 L 325.7 370.4 L 324.7 368.8 L 323.3 367.5 L 322.5 365.8 L 321.3 364.3 L 320.1 362.7 L 318.8 361.2 L 316.8 360.9 L 315.0 360.0 L 315.1 358.7 L 315.2 357.4 L 315.1 356.0 L 315.5 354.7 L 316.8 354.0 L 317.6 352.8 L 318.2 351.6 L 318.3 350.2 L 318.6 348.9 L 319.2 347.7 L 319.2 346.4 L 319.0 345.1 L 319.1 343.8 L 319.1 342.5 L 319.3 341.1 L 320.0 340.0 Z',
            labelPos: { x: 370, y: 355 }
        },
        {
            id: 'victoria-island',
            name: 'Victoria Island',
            description: 'Luxury, FDI & tech startup district',
            color: '#f5c542',
            gdpShare: 0.22,
            popShare: 0.06,
            devLevel: 78,
            specialization: 'Tech & FDI',
            path: 'M 430.0 350.0 L 432.9 350.0 L 435.5 348.5 L 438.4 348.3 L 440.9 346.8 L 443.6 345.6 L 445.7 343.4 L 448.6 342.9 L 451.6 343.2 L 453.6 341.0 L 456.5 340.1 L 459.4 339.7 L 461.9 338.1 L 464.0 335.9 L 464.8 332.9 L 467.0 330.8 L 470.0 330.0 L 473.9 329.4 L 477.9 329.8 L 481.9 329.4 L 485.3 327.2 L 489.3 327.5 L 493.2 328.1 L 497.0 329.6 L 500.0 332.2 L 503.7 333.2 L 507.4 334.0 L 511.0 335.5 L 514.8 336.0 L 518.6 335.2 L 522.4 335.7 L 526.2 334.9 L 530.0 335.0 L 530.5 337.0 L 531.2 339.0 L 532.1 340.9 L 532.4 343.0 L 534.1 344.4 L 535.2 346.3 L 536.3 348.3 L 536.3 350.5 L 538.2 351.5 L 540.2 352.1 L 542.0 353.3 L 543.3 355.0 L 544.8 356.5 L 546.9 357.2 L 548.1 358.9 L 550.0 360.0 L 550.3 362.2 L 550.5 364.4 L 549.6 366.5 L 549.5 368.8 L 548.8 370.9 L 548.8 373.2 L 547.9 375.3 L 546.4 376.9 L 544.6 378.5 L 542.4 379.1 L 541.3 381.0 L 540.0 382.9 L 538.8 384.7 L 537.4 386.3 L 536.2 388.2 L 535.0 390.0 L 532.2 391.1 L 529.1 391.3 L 526.1 391.1 L 523.3 389.7 L 520.5 390.5 L 517.6 391.2 L 514.7 391.7 L 511.8 391.9 L 508.9 392.8 L 505.8 392.9 L 502.8 393.3 L 499.7 392.8 L 496.6 393.3 L 494.1 395.3 L 492.1 397.7 L 490.0 400.0 L 488.2 396.9 L 485.3 394.9 L 481.7 394.7 L 478.5 393.2 L 475.8 391.1 L 473.2 388.9 L 469.7 388.6 L 466.6 387.1 L 463.0 387.0 L 459.5 386.4 L 456.7 388.9 L 453.0 389.6 L 449.9 387.9 L 447.1 385.6 L 443.6 384.3 L 440.0 385.0 L 439.1 383.9 L 438.0 383.1 L 436.9 382.3 L 436.3 381.0 L 435.1 380.2 L 434.2 379.1 L 432.9 378.5 L 431.4 378.6 L 431.0 377.2 L 430.4 376.0 L 429.3 375.1 L 428.1 374.4 L 427.5 373.1 L 426.6 372.1 L 425.5 371.3 L 425.0 370.0 L 425.2 368.7 L 425.2 367.4 L 426.0 366.3 L 426.5 365.1 L 427.0 363.8 L 427.9 362.8 L 427.7 361.5 L 428.0 360.1 L 428.5 358.8 L 428.4 357.4 L 429.1 356.2 L 430.1 355.3 L 429.9 353.9 L 429.5 352.6 L 429.9 351.3 L 430.0 350.0 Z',
            labelPos: { x: 488, y: 365 }
        },
        {
            id: 'ikeja',
            name: 'Ikeja',
            description: 'Administrative center & manufacturing zone',
            color: '#00b4d8',
            gdpShare: 0.18,
            popShare: 0.20,
            devLevel: 55,
            specialization: 'Admin & Manufacturing',
            path: 'M 200.0 160.0 L 206.6 160.0 L 213.2 160.8 L 219.4 158.5 L 225.1 155.0 L 230.5 151.4 L 236.6 149.1 L 243.0 147.6 L 249.5 147.6 L 256.0 148.5 L 262.4 147.5 L 268.2 144.2 L 274.8 144.1 L 280.9 142.0 L 287.1 140.1 L 293.6 142.0 L 300.0 140.0 L 305.6 140.4 L 311.1 141.6 L 316.7 142.9 L 321.3 146.2 L 323.2 151.7 L 327.1 156.1 L 331.7 159.6 L 337.0 161.9 L 342.6 162.3 L 348.2 162.0 L 354.0 161.1 L 358.3 157.3 L 363.4 159.7 L 368.9 161.1 L 374.3 158.9 L 380.0 160.0 L 379.8 164.2 L 380.0 168.4 L 382.5 171.8 L 384.1 175.7 L 384.8 179.8 L 386.0 183.8 L 384.6 187.7 L 384.3 191.9 L 387.4 194.8 L 389.2 198.6 L 389.7 202.7 L 390.8 206.7 L 394.3 209.1 L 396.9 212.3 L 398.5 216.1 L 400.0 220.0 L 396.4 222.6 L 393.3 225.7 L 390.1 228.8 L 386.1 230.9 L 383.9 234.8 L 382.9 239.2 L 380.2 242.7 L 377.7 246.4 L 379.3 250.7 L 380.5 255.2 L 380.5 260.0 L 378.0 264.1 L 376.3 268.4 L 372.7 271.4 L 370.4 275.4 L 370.0 280.0 L 364.8 278.4 L 359.4 279.3 L 354.1 278.5 L 348.8 279.6 L 343.2 279.7 L 338.3 282.2 L 333.1 280.0 L 327.6 280.3 L 323.2 283.8 L 317.9 285.7 L 312.4 286.9 L 306.8 286.4 L 303.9 291.2 L 299.2 294.2 L 294.1 296.3 L 290.0 300.0 L 285.7 297.3 L 280.7 296.4 L 277.9 292.1 L 273.6 289.4 L 269.4 286.1 L 267.6 281.2 L 263.3 278.4 L 258.5 276.9 L 253.8 275.1 L 249.5 272.4 L 244.5 271.0 L 239.5 272.1 L 235.1 269.3 L 230.0 268.3 L 224.8 268.0 L 220.0 270.0 L 218.0 266.0 L 214.7 263.0 L 213.7 258.6 L 213.0 254.3 L 212.8 249.8 L 213.7 245.5 L 212.9 241.1 L 210.6 237.2 L 208.7 233.1 L 208.3 228.7 L 204.5 226.0 L 202.6 221.8 L 198.5 220.1 L 195.3 217.0 L 192.3 213.8 L 190.0 210.0 L 193.0 208.2 L 194.7 205.1 L 196.0 201.9 L 198.6 199.5 L 199.8 196.2 L 199.1 192.7 L 199.2 189.3 L 200.5 186.1 L 201.9 182.8 L 201.4 179.3 L 199.5 176.4 L 198.5 173.1 L 198.2 169.7 L 199.4 166.6 L 199.6 163.3 L 200.0 160.0 Z',
            labelPos: { x: 295, y: 220 }
        },
        {
            id: 'lekki',
            name: 'Lekki',
            description: 'New development & free trade zone',
            color: '#8b5cf6',
            gdpShare: 0.12,
            popShare: 0.10,
            devLevel: 42,
            specialization: 'Free Trade Zone',
            path: 'M 550.0 360.0 L 554.6 359.4 L 559.0 357.7 L 563.1 355.2 L 567.9 355.4 L 572.6 356.1 L 577.1 354.4 L 581.7 354.7 L 586.4 354.8 L 590.9 354.0 L 595.2 352.0 L 599.7 350.9 L 603.7 348.5 L 607.7 346.1 L 611.2 343.0 L 615.5 341.2 L 620.0 340.0 L 626.0 339.0 L 632.0 339.4 L 638.0 340.2 L 643.9 341.5 L 650.0 341.6 L 656.1 342.4 L 661.6 339.7 L 667.6 338.4 L 673.5 340.1 L 678.2 344.2 L 684.1 345.3 L 689.9 347.0 L 694.6 351.1 L 700.7 352.3 L 705.0 356.6 L 710.0 360.0 L 710.8 363.1 L 712.0 366.1 L 712.8 369.3 L 714.3 372.2 L 716.6 374.5 L 718.9 377.0 L 719.7 380.3 L 720.2 383.6 L 723.4 384.5 L 726.1 386.4 L 728.6 388.5 L 731.1 390.6 L 732.9 393.4 L 735.7 395.1 L 737.4 397.9 L 740.0 400.0 L 738.1 403.2 L 736.9 406.8 L 736.5 410.5 L 735.0 414.0 L 733.0 417.2 L 730.0 419.5 L 727.6 422.6 L 724.0 424.0 L 720.8 425.9 L 717.2 426.8 L 714.6 429.4 L 711.9 431.9 L 708.3 432.8 L 705.3 435.0 L 703.3 438.2 L 700.0 440.0 L 694.9 441.4 L 689.8 439.8 L 684.7 440.1 L 679.9 442.0 L 674.8 442.5 L 670.1 444.5 L 665.5 447.0 L 660.3 447.1 L 655.6 449.3 L 650.7 451.2 L 645.7 452.7 L 640.4 452.2 L 635.6 449.8 L 630.3 450.2 L 625.2 450.0 L 620.0 450.0 L 615.6 449.6 L 611.2 449.8 L 606.9 448.3 L 602.5 449.1 L 599.1 446.0 L 594.7 444.6 L 590.4 443.6 L 586.0 443.1 L 584.2 439.0 L 581.4 435.4 L 578.4 432.1 L 575.4 428.8 L 572.9 424.9 L 569.0 422.2 L 564.5 421.0 L 560.0 420.0 L 559.2 417.8 L 558.4 415.6 L 558.4 413.2 L 558.1 410.8 L 556.4 409.1 L 555.2 407.1 L 553.8 405.0 L 553.6 402.6 L 551.8 401.1 L 550.4 399.2 L 548.3 398.1 L 546.7 396.4 L 545.1 394.7 L 543.9 392.7 L 542.0 391.3 L 540.0 390.0 L 540.0 387.9 L 540.3 385.9 L 539.6 383.9 L 539.6 381.8 L 539.5 379.7 L 539.6 377.6 L 541.1 376.0 L 541.7 373.9 L 543.0 372.3 L 544.0 370.5 L 545.5 369.1 L 546.7 367.4 L 548.0 365.8 L 548.4 363.8 L 549.5 362.0 L 550.0 360.0 Z',
            labelPos: { x: 640, y: 395 }
        },
        {
            id: 'apapa',
            name: 'Apapa',
            description: 'Major port & logistics hub',
            color: '#f59e0b',
            gdpShare: 0.13,
            popShare: 0.09,
            devLevel: 48,
            specialization: 'Port & Logistics',
            path: 'M 180.0 310.0 L 183.9 308.4 L 187.2 305.8 L 190.1 302.8 L 192.8 299.6 L 197.0 300.3 L 201.2 300.5 L 205.0 298.5 L 209.3 297.8 L 213.3 296.9 L 217.5 297.2 L 220.8 294.8 L 224.3 292.6 L 228.0 290.6 L 232.1 290.9 L 236.0 290.1 L 240.0 290.0 L 244.4 290.5 L 248.8 291.5 L 253.1 292.6 L 257.5 293.4 L 262.1 292.5 L 266.6 294.2 L 270.3 296.8 L 274.5 298.8 L 278.9 297.4 L 283.5 297.9 L 287.9 296.8 L 292.4 295.8 L 297.0 294.3 L 301.8 295.4 L 306.1 297.4 L 310.0 300.0 L 312.0 301.8 L 312.9 304.4 L 314.8 306.4 L 315.2 309.1 L 315.6 311.8 L 316.1 314.4 L 316.6 317.1 L 318.5 319.1 L 318.0 321.8 L 317.0 324.3 L 317.0 327.0 L 317.6 329.7 L 318.2 332.3 L 319.6 334.7 L 319.5 337.4 L 320.0 340.0 L 319.3 341.1 L 319.1 342.5 L 319.1 343.8 L 319.0 345.1 L 319.2 346.4 L 319.2 347.7 L 318.6 348.9 L 318.3 350.2 L 318.2 351.6 L 317.6 352.8 L 316.8 354.0 L 315.5 354.7 L 315.1 356.0 L 315.2 357.4 L 315.1 358.7 L 315.0 360.0 L 312.3 361.6 L 309.7 363.4 L 306.6 364.0 L 303.4 363.5 L 301.5 365.9 L 300.2 368.8 L 297.4 370.1 L 295.2 372.3 L 294.9 375.4 L 293.4 378.1 L 291.1 380.2 L 289.2 382.5 L 286.5 383.8 L 284.2 385.8 L 282.6 388.4 L 280.0 390.0 L 275.8 390.2 L 271.6 389.8 L 268.4 387.1 L 264.6 385.3 L 261.2 387.7 L 257.1 388.2 L 253.0 388.2 L 249.0 389.3 L 245.4 390.8 L 241.9 392.9 L 239.5 396.2 L 235.8 398.0 L 231.8 396.8 L 227.6 396.9 L 223.5 397.6 L 220.0 400.0 L 217.1 398.0 L 214.2 396.1 L 210.7 395.5 L 207.3 394.3 L 205.4 391.3 L 202.4 389.4 L 200.9 386.1 L 198.4 383.6 L 195.3 381.8 L 193.3 378.7 L 191.7 375.4 L 188.7 373.4 L 185.2 372.6 L 181.7 372.2 L 178.6 370.5 L 175.0 370.0 L 176.6 366.4 L 178.4 362.9 L 177.8 359.0 L 177.5 355.0 L 178.5 351.3 L 178.4 347.4 L 179.3 343.7 L 181.2 340.3 L 183.1 336.8 L 183.4 332.8 L 183.8 328.9 L 182.7 325.1 L 181.2 321.4 L 181.5 317.5 L 181.6 313.6 L 180.0 310.0 Z',
            labelPos: { x: 250, y: 345 }
        },
        {
            id: 'mainland',
            name: 'Mainland',
            description: 'Tech talent, universities & culture',
            color: '#3b82f6',
            gdpShare: 0.10,
            popShare: 0.47,
            devLevel: 35,
            specialization: 'Education & Talent',
            path: 'M 100.0 120.0 L 105.4 116.2 L 111.7 114.4 L 118.2 113.7 L 124.0 110.6 L 129.2 106.3 L 135.1 103.0 L 141.9 104.2 L 148.5 102.3 L 154.7 104.6 L 161.3 105.3 L 167.7 103.2 L 174.3 102.9 L 180.0 99.1 L 186.9 99.0 L 193.3 101.3 L 200.0 100.0 L 199.1 103.9 L 199.7 107.9 L 201.6 111.4 L 201.7 115.5 L 203.4 119.1 L 203.8 123.1 L 205.2 126.7 L 207.5 130.0 L 206.7 133.8 L 205.0 137.4 L 204.2 141.2 L 203.8 145.0 L 203.0 148.8 L 202.0 152.5 L 200.9 156.2 L 200.0 160.0 L 199.6 163.3 L 199.4 166.6 L 198.2 169.7 L 198.5 173.1 L 199.5 176.4 L 201.4 179.3 L 201.9 182.8 L 200.5 186.1 L 199.2 189.3 L 199.1 192.7 L 199.8 196.2 L 198.6 199.5 L 196.0 201.9 L 194.7 205.1 L 193.0 208.2 L 190.0 210.0 L 192.3 213.8 L 195.3 217.0 L 198.5 220.1 L 202.6 221.8 L 204.5 226.0 L 208.3 228.7 L 208.7 233.1 L 210.6 237.2 L 212.9 241.1 L 213.7 245.5 L 212.8 249.8 L 213.0 254.3 L 213.7 258.6 L 214.7 263.0 L 218.0 266.0 L 220.0 270.0 L 224.8 268.0 L 230.0 268.3 L 235.1 269.3 L 239.5 272.1 L 244.5 271.0 L 249.5 272.4 L 253.8 275.1 L 258.5 276.9 L 263.3 278.4 L 267.6 281.2 L 269.4 286.1 L 273.6 289.4 L 277.9 292.1 L 280.7 296.4 L 285.7 297.3 L 290.0 300.0 L 286.8 299.2 L 284.1 297.3 L 280.7 297.5 L 277.7 296.2 L 274.4 296.6 L 271.2 297.0 L 268.1 296.1 L 264.8 296.1 L 261.5 296.8 L 258.3 296.2 L 255.0 295.8 L 252.1 294.3 L 248.8 294.0 L 245.5 293.5 L 243.0 291.4 L 240.0 290.0 L 236.0 290.1 L 232.1 290.9 L 228.0 290.6 L 224.3 292.6 L 220.8 294.8 L 217.5 297.2 L 213.3 296.9 L 209.3 297.8 L 205.0 298.5 L 201.2 300.5 L 197.0 300.3 L 192.8 299.6 L 190.1 302.8 L 187.2 305.8 L 183.9 308.4 L 180.0 310.0 L 175.5 308.9 L 172.2 305.5 L 169.8 301.7 L 167.3 298.0 L 163.2 296.2 L 159.7 293.4 L 158.0 289.1 L 154.3 286.4 L 149.8 286.8 L 145.4 287.4 L 141.2 285.9 L 136.7 285.4 L 132.2 285.9 L 127.8 284.3 L 124.4 281.3 L 120.0 280.0 L 119.9 274.1 L 117.0 268.9 L 115.6 263.4 L 114.4 257.8 L 111.4 252.8 L 106.8 249.2 L 103.0 244.9 L 99.8 240.1 L 95.4 236.2 L 93.3 230.7 L 92.5 225.1 L 90.8 219.6 L 85.6 216.5 L 82.8 211.3 L 80.2 205.9 L 80.0 200.0 L 78.8 194.7 L 79.4 189.4 L 81.5 184.5 L 83.4 179.5 L 86.1 175.0 L 89.0 170.6 L 90.1 165.4 L 91.5 160.4 L 95.4 156.4 L 97.2 151.2 L 100.9 147.0 L 101.7 141.4 L 101.6 136.0 L 102.7 130.6 L 101.8 125.2 L 100.0 120.0 Z',
            labelPos: { x: 160, y: 205 }
        }
    ];

    // Water / lagoon paths
    const WATER_PATHS = [
        // Lagos Lagoon
        'M 50 350 Q 200 300 350 320 Q 500 300 600 320 Q 700 310 780 340 L 780 500 Q 600 480 400 490 Q 200 500 50 480 Z',
        // Atlantic coastline
        'M 50 470 Q 200 450 400 460 Q 600 450 780 470 L 780 600 L 50 600 Z'
    ];

    let selectedDistrict = null;

    function getAll() { return DISTRICTS; }

    function getById(id) { return DISTRICTS.find(d => d.id === id); }

    function getSelected() { return selectedDistrict; }

    function select(id) { selectedDistrict = id; }

    function deselect() { selectedDistrict = null; }

    /**
     * Render the SVG map
     */
    function renderMap(svgElement, viewMode) {
        if (!svgElement) return;
        svgElement.innerHTML = '';

        // Definitions for filters and gradients
        const defs = createSVG('defs', {});

        // Ocean gradient
        const oceanGrad = createSVG('linearGradient', { id: 'oceanGrad', x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
        oceanGrad.appendChild(createSVG('stop', { offset: '0%', 'stop-color': '#061325' }));
        oceanGrad.appendChild(createSVG('stop', { offset: '100%', 'stop-color': '#02070e' }));
        defs.appendChild(oceanGrad);

        // Map drop shadow
        const dropShadow = createSVG('filter', { id: 'dropShadow', x: '-10%', y: '-10%', width: '130%', height: '130%' });
        dropShadow.appendChild(createSVG('feDropShadow', { dx: '0', dy: '8', stdDeviation: '6', 'flood-color': '#000000', 'flood-opacity': '0.7' }));
        defs.appendChild(dropShadow);

        // Inner glow/highlight for landmasses
        const innerGlow = createSVG('filter', { id: 'innerGlow' });
        innerGlow.appendChild(createSVG('feComponentTransfer', { in: 'SourceAlpha' })).appendChild(createSVG('feFuncA', { type: 'linear', slope: '0.8' }));
        innerGlow.appendChild(createSVG('feGaussianBlur', { stdDeviation: '3', result: 'blur' }));
        innerGlow.appendChild(createSVG('feOffset', { dx: '0', dy: '-2' }));
        innerGlow.appendChild(createSVG('feComposite', { operator: 'out', in2: 'SourceAlpha' }));
        innerGlow.appendChild(createSVG('feColorMatrix', { type: 'matrix', values: '0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 0.1 0' }));
        innerGlow.appendChild(createSVG('feBlend', { mode: 'screen', in2: 'SourceGraphic' }));
        defs.appendChild(innerGlow);

        svgElement.appendChild(defs);

        // Background
        const bg = createSVG('rect', {
            x: 0, y: 0, width: 800, height: 600,
            fill: 'url(#oceanGrad)'
        });
        svgElement.appendChild(bg);

        // Grid lines (subtle)
        for (let i = 0; i < 800; i += 50) {
            svgElement.appendChild(createSVG('line', {
                x1: i, y1: 0, x2: i, y2: 600,
                stroke: 'rgba(148,163,184,0.04)', 'stroke-width': 1
            }));
        }
        for (let j = 0; j < 600; j += 50) {
            svgElement.appendChild(createSVG('line', {
                x1: 0, y1: j, x2: 800, y2: j,
                stroke: 'rgba(148,163,184,0.04)', 'stroke-width': 1
            }));
        }

        // Water paths intentionally removed for a cleaner look
        /* WATER_PATHS.forEach(wp => {
            svgElement.appendChild(createSVG('path', {
                d: wp, class: 'water'
            }));
        }); */

        // Water label
        const waterLabel = createSVG('text', {
            x: 400, y: 470, fill: 'rgba(0,180,216,0.3)',
            'font-family': "'Inter', sans-serif",
            'font-size': '14px',
            'font-style': 'italic',
            'text-anchor': 'middle'
        });
        waterLabel.textContent = 'Lagos Lagoon';
        svgElement.appendChild(waterLabel);

        const oceanLabel = createSVG('text', {
            x: 400, y: 550, fill: 'rgba(0,180,216,0.2)',
            'font-family': "'Inter', sans-serif",
            'font-size': '12px',
            'font-style': 'italic',
            'text-anchor': 'middle'
        });
        oceanLabel.textContent = 'Atlantic Ocean';
        svgElement.appendChild(oceanLabel);

        // Districts
        const state = GameEngine.getState();
        DISTRICTS.forEach(d => {
            const fillColor = getDistrictFill(d, viewMode, state);
            const distGroup = createSVG('g', {});

            // Glow effect for selected
            if (selectedDistrict === d.id) {
                const glow = createSVG('path', {
                    d: d.path,
                    fill: 'none',
                    stroke: d.color,
                    'stroke-width': 6,
                    opacity: 0.3,
                    filter: 'blur(4px)'
                });
                distGroup.appendChild(glow);
            }

            // District shape
            const path = createSVG('path', {
                d: d.path,
                fill: fillColor,
                stroke: 'rgba(255,255,255,0.4)',
                'stroke-width': '0.8',
                filter: 'url(#dropShadow)',
                class: `district-path${selectedDistrict === d.id ? ' selected' : ''}`,
                'data-district': d.id
            });
            path.addEventListener('click', () => {
                select(d.id);
                UI.showDistrictDetail(d.id);
                renderMap(svgElement, viewMode);
            });
            path.addEventListener('mouseenter', () => {
                UI.showMapTooltip(d);
            });
            path.addEventListener('mouseleave', () => {
                UI.hideMapTooltip();
            });
            distGroup.appendChild(path);

            // Label
            const label = createSVG('text', {
                x: d.labelPos.x,
                y: d.labelPos.y - 8,
                class: 'district-label'
            });
            label.textContent = d.name;
            distGroup.appendChild(label);

            // Sub-label
            const subLabel = createSVG('text', {
                x: d.labelPos.x,
                y: d.labelPos.y + 8,
                class: 'district-label-sub'
            });
            subLabel.textContent = d.specialization;
            distGroup.appendChild(subLabel);

            // Dev level indicator
            const devText = createSVG('text', {
                x: d.labelPos.x,
                y: d.labelPos.y + 22,
                fill: d.color,
                'font-family': "'Outfit', sans-serif",
                'font-size': '11px',
                'font-weight': '700',
                'text-anchor': 'middle',
                'pointer-events': 'none'
            });
            if (viewMode === 'economy') {
                const econ = GameEngine.getDistrictEconomy(d.id);
                devText.textContent = econ ? `$${econ.gdp}B` : '';
            } else if (viewMode === 'population') {
                const econ = GameEngine.getDistrictEconomy(d.id);
                devText.textContent = econ ? `${econ.population}M` : '';
            } else {
                devText.textContent = `Lv ${Math.round(d.devLevel)}`;
            }
            distGroup.appendChild(devText);

            svgElement.appendChild(distGroup);
        });

        // Compass rose
        const compass = createSVG('text', {
            x: 740, y: 80, fill: 'rgba(148,163,184,0.3)',
            'font-family': "'Outfit', sans-serif",
            'font-size': '18px',
            'font-weight': '600',
            'text-anchor': 'middle'
        });
        compass.textContent = 'N ↑';
        svgElement.appendChild(compass);
    }

    function getDistrictFill(district, viewMode, state) {
        const dev = district.devLevel;
        if (viewMode === 'economy') {
            const econ = GameEngine.getDistrictEconomy(district.id);
            const intensity = econ ? Math.min(econ.gdp / 30, 1) : 0.3;
            return `rgba(${hexToRgb(district.color)}, ${0.3 + intensity * 0.5})`;
        } else if (viewMode === 'population') {
            const pop = district.popShare;
            return `rgba(${hexToRgb(district.color)}, ${0.2 + pop * 0.8})`;
        }
        // Development view
        const hue = (dev / 100) * 120; // 0=red, 120=green
        return `hsla(${hue}, 70%, 35%, 0.7)`;
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r},${g},${b}`;
    }

    function createSVG(tag, attrs) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        return el;
    }

    /**
     * Update district development levels based on policies
     */
    function boostDistrict(districtId, amount) {
        const d = DISTRICTS.find(dd => dd.id === districtId);
        if (d) {
            d.devLevel = Math.min(100, Math.max(0, d.devLevel + amount));
        }
    }

    function boostAllDistricts(amount) {
        DISTRICTS.forEach(d => {
            d.devLevel = Math.min(100, Math.max(0, d.devLevel + amount));
        });
    }

    return {
        getAll,
        getById,
        getSelected,
        select,
        deselect,
        renderMap,
        boostDistrict,
        boostAllDistricts
    };
})();
