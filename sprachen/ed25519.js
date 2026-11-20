window.RYVO_ED = (() => {
const P = 2n ** 255n - 19n, L = 2n ** 252n + 27742317777372353535851937790883648493n, U = (x) => BigInt.asUintN(64, x);
const K = '428a2f98d728ae227137449123ef65cdb5c0fbcfec4d3b2fe9b5dba58189dbbc3956c25bf348b53859f111f1b605d019923f82a4af194f9bab1c5ed5da6d8118d807aa98a303024212835b0145706fbe243185be4ee4b28c550c7dc3d5ffb4e272be5d74f27b896f80deb1fe3b1696b19bdc06a725c71235c19bf174cf692694e49b69c19ef14ad2efbe4786384f25e30fc19dc68b8cd5b5240ca1cc77ac9c652de92c6f592b02754a7484aa6ea6e4835cb0a9dcbd41fbd476f988da831153b5983e5152ee66dfaba831c66d2db43210b00327c898fb213fbf597fc7beef0ee4c6e00bf33da88fc2d5a79147930aa72506ca6351e003826f142929670a0e6e7027b70a8546d22ffc2e1b21385c26c9264d2c6dfc5ac42aed53380d139d95b3df650a73548baf63de766a0abb3c77b2a881c2c92e47edaee692722c851482353ba2bfe8a14cf10364a81a664bbc423001c24b8b70d0f89791c76c51a30654be30d192e819d6ef5218d69906245565a910f40e35855771202a106aa07032bbd1b819a4c116b8d2d0c81e376c085141ab532748774cdf8eeb9934b0bcb5e19b48a8391c0cb3c5c95a634ed8aa4ae3418acb5b9cca4f7763e373682e6ff3d6b2b8a3748f82ee5defb2fc78a5636f43172f6084c87814a1f0ab728cc702081a6439ec90befffa23631e28a4506cebde82bde9bef9a3f7b2c67915c67178f2e372532bca273eceea26619cd186b8c721c0c207eada7dd6cde0eb1ef57d4f7fee6ed17806f067aa72176fba0a637dc5a2c898a6113f9804bef90dae1b710b35131c471b28db77f523047d8432caab7b40c724933c9ebe0a15c9bebc431d67c49c100d4c4cc5d4becb3e42b6597f299cfc657e2a5fcb6fab3ad6faec6c44198c4a475817'.match(/.{16}/g).map((h) => BigInt('0x' + h)), IV = '6a09e667f3bcc908bb67ae8584caa73b3c6ef372fe94f82ba54ff53a5f1d36f1510e527fade682d19b05688c2b3e6c1f1f83d9abfb41bd6b5be0cd19137e2179'.match(/.{16}/g).map((h) => BigInt('0x' + h));
const r = (x, n) => (x >> BigInt(n)) | U(x << BigInt(64 - n));
function sha512(m) {
const n = (m.length + 17 + 127) & ~127, b = new Uint8Array(n), H = IV.slice();
b.set(m); b[m.length] = 128; for (let i = 0, x = BigInt(m.length) * 8n; i < 16; i++, x >>= 8n) b[n - 1 - i] = Number(x & 255n);
for (let o = 0; o < n; o += 128) {
const w = [];
for (let i = 0; i < 16; i++) { let x = 0n; for (let j = 0; j < 8; j++) x = (x << 8n) | BigInt(b[o + 8 * i + j]); w.push(x); }
for (let i = 16; i < 80; i++) w.push(U(w[i - 16] + (r(w[i - 15], 1) ^ r(w[i - 15], 8) ^ (w[i - 15] >> 7n)) + w[i - 7] + (r(w[i - 2], 19) ^ r(w[i - 2], 61) ^ (w[i - 2] >> 6n))));
let [a, c, d, e, f, g, h, k] = H;
for (let i = 0; i < 80; i++) {
const t1 = U(k + (r(f, 14) ^ r(f, 18) ^ r(f, 41)) + ((f & g) ^ (U(~f) & h)) + K[i] + w[i]), t2 = U((r(a, 28) ^ r(a, 34) ^ r(a, 39)) + ((a & c) ^ (a & d) ^ (c & d)));
k = h; h = g; g = f; f = U(e + t1); e = d; d = c; c = a; a = U(t1 + t2);
}
[a, c, d, e, f, g, h, k].forEach((x, i) => { H[i] = U(H[i] + x); });
}
const aus = new Uint8Array(64); H.forEach((x, i) => { for (let j = 7; j >= 0; j--, x >>= 8n) aus[8 * i + j] = Number(x & 255n); }); return aus;
}
const md = (a, q = P) => { a %= q; return a < 0n ? a + q : a; };
const pw = (b, e) => { let x = 1n; b = md(b); for (; e > 0n; e >>= 1n) { if (e & 1n) x = x * b % P; b = b * b % P; } return x; };
const le = (b) => { let x = 0n; for (let i = b.length - 1; i >= 0; i--) x = (x << 8n) | BigInt(b[i]); return x; };
const D = md(-121665n * pw(121666n, P - 2n)), I = pw(2n, (P - 1n) / 4n);
const add = ([X1, Y1, Z1, T1], [X2, Y2, Z2, T2]) => {
const A = md((Y1 - X1) * (Y2 - X2)), B = md((Y1 + X1) * (Y2 + X2)), C = md(2n * D * T1 % P * T2), E = md(2n * Z1 * Z2), F = B - A, G = E - C, H = E + C, J = B + A;
return [md(F * G), md(H * J), md(G * H), md(F * J)];
};
const mul = (p, s) => { let q = [0n, 1n, 1n, 0n]; for (; s > 0n; s >>= 1n) { if (s & 1n) q = add(q, p); p = add(p, p); } return q; };
const punkt = (b) => {
let y = le(b); const s = y >> 255n; y &= (1n << 255n) - 1n; if (y >= P) return null;
const u = md(y * y - 1n), v = md(D * y * y + 1n); let x = md(u * pw(v, 3n) * pw(u * pw(v, 7n), (P - 5n) / 8n));
if (md(v * x * x - u)) { if (md(v * x * x + u)) return null; x = x * I % P; }
if (!x && s) return null; if ((x & 1n) !== s) x = P - x;
return [x, y, 1n, x * y % P];
};
const yB = 4n * pw(5n, P - 2n) % P, Bb = new Uint8Array(32); for (let i = 0, y = yB; i < 32; i++, y >>= 8n) Bb[i] = Number(y & 255n);
const B = punkt(Bb);
return (sig, msg, pub) => {
if (sig.length !== 64 || pub.length !== 32) return false;
const A = punkt(pub), R = punkt(sig.subarray(0, 32)), S = le(sig.subarray(32)); if (!A || !R || S >= L) return false;
const m = new Uint8Array(64 + msg.length); m.set(sig.subarray(0, 32)); m.set(pub, 32); m.set(msg, 64);
const h = md(le(sha512(m)), L), l = mul(B, S), q = add(R, mul(A, h));
return !md(l[0] * q[2] - q[0] * l[2]) && !md(l[1] * q[2] - q[1] * l[2]);
};
})();;
