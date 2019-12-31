/*
 * A free and open source chess game using AssemblyScript and React
 * Copyright (C) 2019 mhonert (https://github.com/mhonert)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


import { B, K, N, P, Q, QUEEN, R } from '../pieces';
import {
  BLACK_MATE_SCORE,
  decodeMove,
  decodeScore,
  encodeScoredMove,
  evaluatePosition,
  findBestMove,
  WHITE_MATE_SCORE
} from '../engine';
import {
  __,
  BLACK,
  BLACK_KING_MOVED,
  BLACK_LEFT_ROOK_MOVED,
  BLACK_RIGHT_ROOK_MOVED,
  Board,
  WHITE,
  WHITE_KING_MOVED,
  WHITE_RIGHT_ROOK_MOVED
} from '../board';
import { encodeMove, isCheckMate } from '../move-generation';

describe('Encode and decode scored moves', () => {
  it('Zero score', () => {
    const score = 0;
    const move = encodeMove(QUEEN, 2, 98);

    const scoredMove = encodeScoredMove(move, score);

    expect(decodeMove(scoredMove)).toBe(move, "Correctly extracted move");
    expect(decodeScore(scoredMove)).toBe(score, "Correctly extracted score");
  });

  it('Positive scores', () => {
    const score = 16383;
    const move = encodeMove(QUEEN, 2, 98);

    const scoredMove = encodeScoredMove(move, score);

    expect(decodeMove(scoredMove)).toBe(move, "Correctly extracted move");
    expect(decodeScore(scoredMove)).toBe(score, "Correctly extracted score");
  });

  it('Negative score', () => {
    const score = -16383;
    const move = encodeMove(QUEEN, 2, 98);

    const scoredMove = encodeScoredMove(move, score);

    expect(decodeMove(scoredMove)).toBe(move, "Correctly extracted move");
    expect(decodeScore(scoredMove)).toBe(score, "Correctly extracted score");
  });

});

describe('Evaluate position', () => {
  it('Calculates even score for starting position', () => {
    const board: Array<i32> = [
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __,
      __, -R, -N, -B, -Q, -K, -B, -N, -R, __,
      __, -P, -P, -P, -P, -P, -P, -P, -P, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __, +P, +P, +P, +P, +P, +P, +P, +P, __,
      __, +R, +N, +B, +Q, +K, +B, +N, +R, __,
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __, 0, 0, 0
    ];

    const score = evaluatePosition(new Board(board));
    expect(score).toBe(0);
  });

  // TODO: Store pawn bitboard in Board class and take them into account for the scoring function
  // it('Calculates lower score for doubled pawns', () => {
  //   const board: Array<i32> = [
  //     __, __, __, __, __, __, __, __, __, __,
  //     __, __, __, __, __, __, __, __, __, __,
  //     __, -R, -N, -B, -Q, -K, -B, -N, -R, __,
  //     __, -P, -P, -P, -P, -P, -P, -P, -P, __,
  //     __,  0,  0,  0,  0,  0,  0,  0,  0, __,
  //     __,  0,  0,  0,  0,  0,  0,  0,  0, __,
  //     __,  0,  0,  0,  0,  0,  0,  0,  0, __,
  //     __,  0,  0,  0,  0, +P,  0,  0,  0, __,
  //     __, +P, +P, +P,  0, +P, +P, +P, +P, __,
  //     __, +R, +N, +B, +Q, +K, +B, +N, +R, __,
  //     __, __, __, __, __, __, __, __, __, __,
  //     __, __, __, __, __, __, __, __, __, __, 0, 0, 0
  //   ];
  //
  //   const score = evaluatePosition(new Board(board));
  //   expect(score).toBeLessThan(0);
  // });

  it('Calculates higher score for pieces outside starting position', () => {
    const board: Array<i32> = [
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __,
      __, -R, -N, -B, -Q, -K, -B, -N, -R, __,
      __, -P, -P, -P, -P, -P, -P, -P, -P, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0, +P,  0,  0,  0, __,
      __,  0,  0, +N,  0,  0,  0,  0,  0, __,
      __, +P, +P, +P, +P,  0, +P, +P, +P, __,
      __, +R,  0, +B, +Q, +K, +B, +N, +R, __,
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __, 0, 0, 0
    ];

    const score = evaluatePosition(new Board(board));
    expect(score).toBeGreaterThan(0);
  });

  it('Calculates higher score for material advantage', () => {
    const board: Array<i32> = [
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __,
      __, -R, -N, -B, -Q, -K, -B, -N, -R, __,
      __, -P, -P, -P, -P,  0, -P, -P, -P, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __, +P, +P, +P, +P, +P, +P, +P, +P, __,
      __, +R, +N, +B, +Q, +K, +B, +N, +R, __,
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __, 0, 0, 0
    ];

    const score = evaluatePosition(new Board(board));
    expect(score).toBeGreaterThan(0);
  });

  it('Calculates higher score for castled king position', () => {
    const board: Array<i32> = [
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __,
      __,  0,  0,  0,  0, -K,  0,  0, -R, __,
      __,  0,  0,  0,  0, -P, -P, -P, -P, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0, +P, +P, +P, +P, __,
      __,  0,  0,  0,  0,  0, +R, +K,  0, __,
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __, 0, 0, WHITE_KING_MOVED | WHITE_RIGHT_ROOK_MOVED
    ];

    const score = evaluatePosition(new Board(board));
    expect(score).toBeGreaterThan(0);
  });

  it('Calculate score if white is check mate', () => {
    const board: Board = new Board([
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __,
      __,  0,  0,  0,  0, +K,  0,  0, -R, __,
      __, -R,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0, -K,  0,  0,  0, __,
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __, 0, 0, 0
    ]);

    const score = evaluatePosition(board);
    expect(score).toBe(WHITE_MATE_SCORE);
  });

  it('Calculate score if black is check mate', () => {
    const board: Board = new Board([
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __,
      __,  0,  0,  0,  0, -K,  0,  0, +R, __,
      __, +R,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0, +K,  0,  0,  0, __,
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __, 0, 0, 0
    ]);

    const score = evaluatePosition(board);
    expect(score).toBe(BLACK_MATE_SCORE);
  });
});

describe('Finds moves', () => {
  it('Finds mate in 1 move', () => {
    // prettier-ignore
    const board: Board = new Board([
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __,
      __,  0,  0,  0,  0, +K,  0,  0,  0, __,
      __, -R,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0, -K,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0, -R, __,
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __, 0, 0, WHITE_KING_MOVED | BLACK_KING_MOVED
    ]);

    board.performEncodedMove(findBestMove(board, BLACK, 2));

    expect(isCheckMate(board, WHITE)).toBe(true);
  });

  it('Finds mate in two moves', () => {
    // prettier-ignore
    const board: Board = new Board([
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __,
      __,  0,  0,  0,  0, -K,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __, +R,  0,  0,  0, +K,  0,  0, +R, __,
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __, 0, 0, BLACK_LEFT_ROOK_MOVED | BLACK_RIGHT_ROOK_MOVED
    ]);

    board.performEncodedMove(findBestMove(board, WHITE, 3));
    board.performEncodedMove(findBestMove(board, BLACK, 2));
    board.performEncodedMove(findBestMove(board, WHITE, 1));

    expect(isCheckMate(board, BLACK)).toBe(true);
  });

  it('Finds another mate in two moves', () => {
    // prettier-ignore
    const board: Board = new Board([
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __,
      __,  0,  0,  0, -B, -R, -R, -B,  0, __,
      __,  0,  0, +N,  0,  0,  0,  0, +B, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0, -P,  0,  0,  0,  0, +Q, __,
      __,  0,  0, -P,  0,  0, -K,  0,  0, __,
      __,  0,  0,  0,  0,  0, +P,  0,  0, __,
      __,  0,  0,  0,  0, +P,  0, +K, +R, __,
      __,  0,  0, +N,  0,  0, +R, +B,  0, __,
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __, 0, 0, BLACK_LEFT_ROOK_MOVED | BLACK_RIGHT_ROOK_MOVED
    ]);

    board.performEncodedMove(findBestMove(board, WHITE, 3));
    board.performEncodedMove(findBestMove(board, BLACK, 2));
    board.performEncodedMove(findBestMove(board, WHITE, 1));

    expect(isCheckMate(board, BLACK)).toBe(true);
  });

  it('Finds opening move', () => {
    // prettier-ignore
    const board: Board = new Board([
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __,
      __, -R, -N, -B, -Q, -K, -B, -N, -R, __,
      __, -P, -P, -P, -P, -P, -P, -P, -P, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __, +P, +P, +P, +P, +P, +P, +P, +P, __,
      __, +R, +N, +B, +Q, +K, +B, +N, +R, __,
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __, 0, 0, 0
    ]);

    const move = findBestMove(board, WHITE, 4);
    expect(move).toBeGreaterThan(0, "An encoded move");
  });

  it('Does not sacrifice queen', () => {
    // prettier-ignore
    const board: Board = new Board([
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __,
      __, -R,  0, -B, -Q,  0, -R,  0, -K, __,
      __,  0, -P, -P,  0, -N, -P,  0,  0, __,
      __, -P,  0,  0, -P, -P,  0,  0, -P, __,
      __,  0,  0,  0,  0,  0, -P,  0,  0, __,
      __, +B,  0, +P,  0, +P,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0, +Q,  0, __,
      __, +P, +P, +P, +N,  0, +P, +P, +P, __,
      __, +R,  0,  0,  0,  0, +R, +K,  0, __,
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __, 0, 0, 0
    ]);

    const move = findBestMove(board, WHITE, 2);
    board.performEncodedMove(move);
    expect(move).not.toBe(encodeMove(5, 77, 37), "Must not sacrifice queen @37");
    expect(move).not.toBe(encodeMove(5, 77, 44), "Must not sacrifice queen @44");
  });


  it('Avoids stalemate when it is ahead of the opponent', () => {
    // prettier-ignore
    const board: Board = new Board([
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0,  R, __,
      __,  0,  0,  0,  0,  0,  B,  0,  0, __,
      __,  0,  0,  0,  N,  0,  P,  0,  0, __,
      __,  0,  0,  0,  0,  P,  0, -K,  0, __,
      __,  0,  0,  0,  0,  0,  0,  0, -R, __,
      __,  0,  0,  0,  0,  0,  0,  P,  K, __,
      __,  0,  0,  0,  0,  0,  0,  0,  0, __,
      __, __, __, __, __, __, __, __, __, __,
      __, __, __, __, __, __, __, __, __, __, 0, 0, WHITE_KING_MOVED | BLACK_KING_MOVED
    ]);

    const move = findBestMove(board, WHITE, 2);
    expect(move).not.toBe(encodeMove(4, 38, 78), "Using the rook to capture the black rook causes a stalemate");
    expect(move).toBe(encodeMove(1, 87, 78), "Using the pawn for the capture lets the game proceed");
  });
});
